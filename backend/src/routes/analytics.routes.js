import { Router } from "express";
import { exportAnalytics, getAnalyticsSummary } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/summary", getAnalyticsSummary);
router.get("/export", exportAnalytics);

export default router;
