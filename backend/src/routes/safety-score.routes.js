import { Router } from "express";
import { safetyScoreController } from "../controllers/safety-score.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", safetyScoreController.listDriverSafetyScores);
router.get("/summary", safetyScoreController.getSafetyScoreSummary);
router.post("/recalculate", requireRole("Manager"), safetyScoreController.recalculateAllDriverScores);
router.get("/:driverId", safetyScoreController.getDriverSafetyScore);

export default router;
