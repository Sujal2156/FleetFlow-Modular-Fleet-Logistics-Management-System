import mongoose from "mongoose";

const odometerHistorySchema = new mongoose.Schema(
  {
    readingId: { type: String, required: true, unique: true, trim: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    odometerKm: { type: Number, required: true, min: 0 },
    distanceCoveredKm: { type: Number, default: 0, min: 0 },
    recordType: {
      type: String,
      enum: ["Trip Start", "Trip End", "Manual Check", "Maintenance"],
      default: "Trip End",
    },
    recordedAt: { type: Date, required: true, default: () => new Date() },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Compound index for vehicle + date queries
odometerHistorySchema.index({ vehicle: 1, recordedAt: -1 });

export default mongoose.model("OdometerHistory", odometerHistorySchema);
