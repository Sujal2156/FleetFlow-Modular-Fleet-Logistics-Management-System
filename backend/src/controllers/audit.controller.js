import AuditLog from "../models/audit.model.js";
import { v4 as uuidv4 } from "uuid";

export async function createAuditLog(req, res, next) {
  try {
    const { action, resource, severity = "MEDIUM", details } = req.body;

    if (!action || !resource) {
      return res.status(400).json({ message: "Action and resource are required" });
    }

    // Only Manager and Safety Officer can create audit logs
    if (!["Manager", "Safety Officer"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Manager or Safety Officer can create audit logs" });
    }

    const auditLog = await AuditLog.create({
      auditId: `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
      user: req.user._id,
      userRole: req.user.role,
      action,
      resource: resource ? { type: resource.type, id: resource.id } : null,
      severity,
      details,
      ipAddress: req.ip,
    });

    const populated = await AuditLog.findById(auditLog._id).populate("user", "fullName email role");
    res.status(201).json({ item: populated });
  } catch (error) {
    next(error);
  }
}

export async function listAuditLogs(req, res, next) {
  try {
    const { action, severity, userRole, limit = 100, skip = 0 } = req.query;

    // Only Manager and Safety Officer can view audit logs
    if (!["Manager", "Safety Officer"].includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const filter = {};
    if (action) filter.action = action;
    if (severity) filter.severity = severity;
    if (userRole) filter.userRole = userRole;

    const items = await AuditLog.find(filter)
      .populate("user", "fullName email role")
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await AuditLog.countDocuments(filter);

    res.status(200).json({ items, total, limit: Number(limit), skip: Number(skip) });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogById(req, res, next) {
  try {
    // Only Manager and Safety Officer can view audit logs
    if (!["Manager", "Safety Officer"].includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const item = await AuditLog.findById(req.params.id).populate("user", "fullName email role");
    if (!item) {
      return res.status(404).json({ message: "Audit log not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

export async function getSafetyDashboard(req, res, next) {
  try {
    // Only Manager and Safety Officer can view safety dashboard
    if (!["Manager", "Safety Officer"].includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Get critical alerts from the last 30 days
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [criticalAlerts, complianceViolations, driverIncidents, maintenanceIssues] = await Promise.all([
      AuditLog.countDocuments({ severity: "CRITICAL", timestamp: { $gte: last30Days } }),
      AuditLog.countDocuments({ action: "COMPLIANCE_VIOLATION_DETECTED", timestamp: { $gte: last30Days } }),
      AuditLog.countDocuments({ action: "INCIDENT_REPORTED", timestamp: { $gte: last30Days } }),
      AuditLog.countDocuments({ action: "VEHICLE_MAINTENANCE_LOGGED", timestamp: { $gte: last30Days } }),
    ]);

    res.status(200).json({
      summary: {
        criticalAlerts,
        complianceViolations,
        driverIncidents,
        maintenanceIssues,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const auditController = {
  createAuditLog,
  listAuditLogs,
  getAuditLogById,
  getSafetyDashboard,
};
