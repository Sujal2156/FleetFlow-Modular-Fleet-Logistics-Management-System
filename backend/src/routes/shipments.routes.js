import { Router } from "express";
import { shipmentController } from "../controllers/shipment.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", shipmentController.list);
router.get("/:id", shipmentController.getById);
router.post("/", requireRole("Manager", "Dispatcher"), shipmentController.create);
router.put("/:id", requireRole("Manager", "Dispatcher"), shipmentController.update);
router.delete("/:id", requireRole("Manager", "Dispatcher"), shipmentController.remove);

export default router;
