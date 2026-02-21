import mongoose from "mongoose";

const driverSafetyScoreSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      unique: true,
    },
    totalTrips: { type: Number, default: 0, min: 0 },
    completedTrips: { type: Number, default: 0, min: 0 },
    onTimeTrips: { type: Number, default: 0, min: 0 }, // Trips completed on or before plannedEndAt
    incidentsCount: { type: Number, default: 0, min: 0 },
    licenseExpiryViolations: { type: Number, default: 0, min: 0 },
    licenseStatus: {
      type: String,
      enum: ["Valid", "Expired Soon (30 days)", "Expired"],
      default: "Valid",
    },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    // Score breakdown
    onTimeCompletionRate: { type: Number, default: 0, min: 0, max: 100 }, // % of trips on time
    incidentRating: { type: Number, default: 100, min: 0, max: 100 }, // 100 = no incidents
    licenseRating: { type: Number, default: 100, min: 0, max: 100 }, // 100 = valid license
    // Score calculation: (onTimeCompletionRate * 0.5) + (incidentRating * 0.3) + (licenseRating * 0.2)
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },
    lastUpdatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.model("DriverSafetyScore", driverSafetyScoreSchema);
