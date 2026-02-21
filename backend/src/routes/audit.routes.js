import { Router } from "express";
import { auditController } from "../controllers/audit.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", requireRole("Manager", "Safety Officer"), auditController.createAuditLog);
router.get("/", requireRole("Manager", "Safety Officer"), auditController.listAuditLogs);
router.get("/dashboard", requireRole("Manager", "Safety Officer"), auditController.getSafetyDashboard);
router.get("/:id", requireRole("Manager", "Safety Officer"), auditController.getAuditLogById);

export default router;
