import { Router } from "express";
import { driverController } from "../controllers/driver.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", driverController.list);
router.get("/:id", driverController.getById);
router.post("/", requireRole("Manager"), driverController.create);
router.put("/:id", requireRole("Manager"), driverController.update);
router.delete("/:id", requireRole("Manager"), driverController.remove);

export default router;
