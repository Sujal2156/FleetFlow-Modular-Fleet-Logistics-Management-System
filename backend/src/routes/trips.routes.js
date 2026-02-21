import { Router } from "express";
import { tripController } from "../controllers/trip.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", tripController.list);
router.get("/:id", tripController.getById);
router.post("/", requireRole("Manager", "Dispatcher"), tripController.create);
router.put("/:id", requireRole("Manager", "Dispatcher"), tripController.update);
router.delete("/:id", requireRole("Manager", "Dispatcher"), tripController.remove);

export default router;
