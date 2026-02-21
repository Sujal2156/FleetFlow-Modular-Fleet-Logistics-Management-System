import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", vehicleController.list);
router.get("/:id", vehicleController.getById);
router.post("/", requireRole("Manager"), vehicleController.create);
router.put("/:id", requireRole("Manager"), vehicleController.update);
router.delete("/:id", requireRole("Manager"), vehicleController.remove);

export default router;
