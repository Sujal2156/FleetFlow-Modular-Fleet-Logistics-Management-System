import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    auditId: { type: String, required: true, unique: true, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: { type: String, required: true },
    action: {
      type: String,
      enum: [
        "DRIVER_LICENSE_EXPIRED",
        "DRIVER_SAFETY_SCORE_UPDATED",
        "VEHICLE_MAINTENANCE_LOGGED",
        "TRIP_CANCELLED_HIGH_RISK",
        "INCIDENT_REPORTED",
        "COMPLIANCE_VIOLATION_DETECTED",
        "USER_CREATED",
        "PASSWORD_RESET",
        "OTHER",
      ],
      required: true,
    },
    resource: {
      type: { type: String }, // e.g., "Driver", "Vehicle", "Trip"
      id: mongoose.Schema.Types.ObjectId,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    details: { type: String, trim: true },
    ipAddress: { type: String },
    timestamp: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
