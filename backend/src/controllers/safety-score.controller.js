import DriverSafetyScore from "../models/driver-safety-score.model.js";
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";
import AuditLog from "../models/audit.model.js";
import { v4 as uuidv4 } from "uuid";

function getLicenseStatus(driver) {
  if (!driver.licenseExpiryAt) return "Valid";

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  if (driver.licenseExpiryAt < today) {
    return "Expired";
  } else if (driver.licenseExpiryAt <= thirtyDaysFromNow) {
    return "Expired Soon (30 days)";
  }
  return "Valid";
}

function calculateRiskLevel(safetyScore) {
  if (safetyScore >= 80) return "LOW";
  if (safetyScore >= 60) return "MEDIUM";
  if (safetyScore >= 40) return "HIGH";
  return "CRITICAL";
}

export async function calculateDriverSafetyScore(driverId) {
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Get all trips for this driver
    const trips = await Trip.find({ driver: driverId, status: { $in: ["Completed", "Dispatched"] } });

    const completedTrips = trips.filter((t) => t.status === "Completed");
    const totalTrips = trips.length;

    // Calculate on-time trips
    let onTimeTrips = 0;
    completedTrips.forEach((trip) => {
      const completionDate = trip.updatedAt || new Date();
      if (completionDate <= trip.plannedEndAt) {
        onTimeTrips++;
      }
    });

    const onTimeCompletionRate = totalTrips > 0 ? (onTimeTrips / totalTrips) * 100 : 0;

    // Get incidents (from audit logs)
    const incidents = await AuditLog.countDocuments({
      "resource.id": driverId,
      action: { $in: ["INCIDENT_REPORTED", "COMPLIANCE_VIOLATION_DETECTED"] },
    });

    // Calculate incident rating (max 5 incidents; each reduces score by 20)
    const incidentRating = Math.max(0, 100 - incidents * 20);

    // Check license status
    const licenseStatus = getLicenseStatus(driver);
    let licenseRating = 100;
    if (licenseStatus === "Expired Soon (30 days)") {
      licenseRating = 70;
    } else if (licenseStatus === "Expired") {
      licenseRating = 0;
    }

    // Calculate overall safety score
    // Formula: (onTimeCompletionRate * 0.5) + (incidentRating * 0.3) + (licenseRating * 0.2)
    const safetyScore = onTimeCompletionRate * 0.5 + incidentRating * 0.3 + licenseRating * 0.2;

    const riskLevel = calculateRiskLevel(safetyScore);

    // Count license violations
    const licenseViolations =
      licenseStatus === "Expired" ? (await AuditLog.countDocuments({ "resource.id": driverId, action: "DRIVER_LICENSE_EXPIRED" })) + 1 : 0;

    // Update or create record
    let scoreRecord = await DriverSafetyScore.findOne({ driver: driverId });

    if (!scoreRecord) {
      scoreRecord = await DriverSafetyScore.create({
        driver: driverId,
        totalTrips,
        completedTrips: completedTrips.length,
        onTimeTrips,
        incidentsCount: incidents,
        licenseExpiryViolations: licenseViolations,
        licenseStatus,
        safetyScore: Math.round(safetyScore * 100) / 100,
        onTimeCompletionRate: Math.round(onTimeCompletionRate * 100) / 100,
        incidentRating,
        licenseRating,
        riskLevel,
        lastUpdatedAt: new Date(),
      });
    } else {
      scoreRecord = await DriverSafetyScore.findByIdAndUpdate(
        scoreRecord._id,
        {
          totalTrips,
          completedTrips: completedTrips.length,
          onTimeTrips,
          incidentsCount: incidents,
          licenseExpiryViolations: licenseViolations,
          licenseStatus,
          safetyScore: Math.round(safetyScore * 100) / 100,
          onTimeCompletionRate: Math.round(onTimeCompletionRate * 100) / 100,
          incidentRating,
          licenseRating,
          riskLevel,
          lastUpdatedAt: new Date(),
        },
        { new: true }
      );
    }

    // Create audit log if safety score is critical
    if (riskLevel === "CRITICAL") {
      await AuditLog.create({
        auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
        user: null, // System generated
        userRole: "System",
        action: "DRIVER_SAFETY_SCORE_UPDATED",
        resource: { type: "Driver", id: driverId },
        severity: "CRITICAL",
        details: `Driver safety score is CRITICAL (${safetyScore.toFixed(2)}/100). Risk Level: ${riskLevel}`,
      });
    }

    return scoreRecord;
  } catch (error) {
    console.error("Error calculating safety score:", error);
    throw error;
  }
}

export async function getDriverSafetyScore(req, res, next) {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    let scoreRecord = await DriverSafetyScore.findOne({ driver: driverId }).populate("driver", "name phone licenseNumber licenseExpiryAt status");

    if (!scoreRecord) {
      // Calculate score if it doesn't exist
      scoreRecord = await calculateDriverSafetyScore(driverId);
      scoreRecord = await DriverSafetyScore.findById(scoreRecord._id).populate("driver", "name phone licenseNumber licenseExpiryAt status");
    }

    res.status(200).json({ item: scoreRecord });
  } catch (error) {
    next(error);
  }
}

export async function listDriverSafetyScores(req, res, next) {
  try {
    const { riskLevel, licenseStatus, sortBy = "-safetyScore", limit = 100, skip = 0 } = req.query;

    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel;
    if (licenseStatus) filter.licenseStatus = licenseStatus;

    const scores = await DriverSafetyScore.find(filter)
      .populate("driver", "name phone licenseNumber licenseExpiryAt status")
      .sort(sortBy)
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await DriverSafetyScore.countDocuments(filter);

    res.status(200).json({ items: scores, total, limit: Number(limit), skip: Number(skip) });
  } catch (error) {
    next(error);
  }
}

export async function recalculateAllDriverScores(req, res, next) {
  try {
    // Only Manager can trigger full recalculation
    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Only Manager can trigger full recalculation" });
    }

    const drivers = await Driver.find();
    const results = [];

    for (const driver of drivers) {
      const scoreRecord = await calculateDriverSafetyScore(driver._id);
      results.push(scoreRecord);
    }

    res.status(200).json({
      message: `Recalculated safety scores for ${results.length} drivers`,
      count: results.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSafetyScoreSummary(req, res, next) {
  try {
    // Only Manager and Safety Officer
    if (!["Manager", "Safety Officer"].includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const [totalDrivers, criticalRiskCount, highRiskCount, mediumRiskCount, lowRiskCount, expiredLicenseCount] = await Promise.all([
      Driver.countDocuments(),
      DriverSafetyScore.countDocuments({ riskLevel: "CRITICAL" }),
      DriverSafetyScore.countDocuments({ riskLevel: "HIGH" }),
      DriverSafetyScore.countDocuments({ riskLevel: "MEDIUM" }),
      DriverSafetyScore.countDocuments({ riskLevel: "LOW" }),
      DriverSafetyScore.countDocuments({ licenseStatus: "Expired" }),
    ]);

    const summary = {
      totalDrivers,
      driversSafetyScoresCalculated: await DriverSafetyScore.countDocuments(),
      criticalRiskCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      expiredLicenseCount,
    };

    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
}

export const safetyScoreController = {
  getDriverSafetyScore,
  listDriverSafetyScores,
  recalculateAllDriverScores,
  getSafetyScoreSummary,
};
