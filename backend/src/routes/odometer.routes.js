import { Router } from "express";
import { odometerController } from "../controllers/odometer.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", requireRole("Manager", "Dispatcher"), odometerController.recordOdometerReading);
router.get("/", odometerController.listAllOdometerReadings);
router.get("/vehicle/:vehicleId", odometerController.getVehicleOdometerHistory);
router.get("/stats/:vehicleId", odometerController.getVehicleOdometerStats);
router.get("/:id", odometerController.getOdometerReadingById);

export default router;
