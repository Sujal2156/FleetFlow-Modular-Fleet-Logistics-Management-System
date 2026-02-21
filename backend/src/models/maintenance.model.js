import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true, trim: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    issueService: { type: String, required: true, trim: true },
    serviceDate: { type: Date, required: true },
    cost: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Maintenance", maintenanceSchema);
