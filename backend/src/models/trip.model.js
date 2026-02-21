import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripCode: { type: String, required: true, unique: true, trim: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    plannedStartAt: { type: Date, required: true },
    plannedEndAt: { type: Date, required: true },
    distanceKm: { type: Number, min: 0, default: 0 },
    revenue: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
