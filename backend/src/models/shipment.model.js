import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    weightKg: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);
