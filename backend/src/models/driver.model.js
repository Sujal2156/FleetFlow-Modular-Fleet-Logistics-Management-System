import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    licenseExpiryAt: { type: Date },
    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty", "Suspended", "Inactive"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
