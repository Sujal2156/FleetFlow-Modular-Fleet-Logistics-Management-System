import OdometerHistory from "../models/odometer.model.js";
import Vehicle from "../models/vehicle.model.js";
import Trip from "../models/trip.model.js";
import { v4 as uuidv4 } from "uuid";

export async function recordOdometerReading(req, res, next) {
  try {
    const { vehicleId, odometerKm, recordType = "Manual Check", notes } = req.body;

    if (!vehicleId || odometerKm === undefined) {
      return res.status(400).json({ message: "Vehicle ID and odometer reading are required" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Get the last odometer reading for this vehicle
    const lastReading = await OdometerHistory.findOne({ vehicle: vehicleId }).sort({ recordedAt: -1 });
    const previousOdometerKm = lastReading?.odometerKm || 0;

    // Validate odometer doesn't go backwards
    if (odometerKm < previousOdometerKm) {
      return res.status(400).json({
        message: `Odometer reading must be >= previous reading (${previousOdometerKm} km)`,
      });
    }

    const distanceCovered = odometerKm - previousOdometerKm;

    const reading = await OdometerHistory.create({
      readingId: `ODO-${uuidv4().substring(0, 8).toUpperCase()}`,
      vehicle: vehicleId,
      odometerKm,
      distanceCoveredKm: distanceCovered,
      recordType,
      recordedAt: new Date(),
      notes,
    });

    const populated = await OdometerHistory.findById(reading._id).populate("vehicle", "vehicleNumber type region");
    res.status(201).json({ item: populated });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleOdometerHistory(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const readings = await OdometerHistory.find({ vehicle: vehicleId })
      .populate("vehicle", "vehicleNumber type region")
      .populate("trip", "tripCode status")
      .sort({ recordedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await OdometerHistory.countDocuments({ vehicle: vehicleId });

    // Calculate stats for this vehicle
    const latestReading = readings[0];
    const stats = {
      currentOdometerKm: latestReading?.odometerKm || 0,
      totalDistanceCoveredKm: readings.reduce((sum, r) => sum + r.distanceCoveredKm, 0),
      readingsCount: total,
    };

    res.status(200).json({ items: readings, total, stats, limit: Number(limit), skip: Number(skip) });
  } catch (error) {
    next(error);
  }
}

export async function listAllOdometerReadings(req, res, next) {
  try {
    const { vehicleType, limit = 100, skip = 0 } = req.query;

    const filter = {};
    if (vehicleType) {
      const vehicles = await Vehicle.find({ type: vehicleType });
      const vehicleIds = vehicles.map((v) => v._id);
      filter.vehicle = { $in: vehicleIds };
    }

    const readings = await OdometerHistory.find(filter)
      .populate("vehicle", "vehicleNumber type region")
      .sort({ recordedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await OdometerHistory.countDocuments(filter);

    res.status(200).json({ items: readings, total, limit: Number(limit), skip: Number(skip) });
  } catch (error) {
    next(error);
  }
}

export async function getOdometerReadingById(req, res, next) {
  try {
    const reading = await OdometerHistory.findById(req.params.id)
      .populate("vehicle", "vehicleNumber type region")
      .populate("trip", "tripCode status");

    if (!reading) {
      return res.status(404).json({ message: "Odometer reading not found" });
    }

    res.status(200).json({ item: reading });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleOdometerStats(req, res, next) {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const readings = await OdometerHistory.find({ vehicle: vehicleId }).sort({ recordedAt: -1 });

    const stats = {
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      currentOdometerKm: readings[0]?.odometerKm || 0,
      totalDistanceCoveredKm: readings.reduce((sum, r) => sum + r.distanceCoveredKm, 0),
      readingsCount: readings.length,
      firstReadingDate: readings[readings.length - 1]?.recordedAt || null,
      lastReadingDate: readings[0]?.recordedAt || null,
    };

    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
}

export const odometerController = {
  recordOdometerReading,
  getVehicleOdometerHistory,
  listAllOdometerReadings,
  getOdometerReadingById,
  getVehicleOdometerStats,
};
