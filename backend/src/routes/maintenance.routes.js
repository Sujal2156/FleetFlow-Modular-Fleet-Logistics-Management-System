import { Router } from "express";
import { maintenanceController } from "../controllers/maintenance.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", maintenanceController.list);
router.get("/:id", maintenanceController.getById);
router.post("/", requireRole("Manager"), maintenanceController.create);
router.put("/:id", requireRole("Manager"), maintenanceController.update);
router.delete("/:id", requireRole("Manager"), maintenanceController.remove);

export default router;
