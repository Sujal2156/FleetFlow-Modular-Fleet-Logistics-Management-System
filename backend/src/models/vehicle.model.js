import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Truck", "Van", "Mini Truck", "Container", "Other"],
    },
    capacityKg: { type: Number, required: true, min: 0 },
    acquisitionCost: { type: Number, min: 0, default: 0 },
    region: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Available", "In Transit", "Maintenance", "Inactive"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
