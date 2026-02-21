import { Router } from "express";
import { login, me, register, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", optionalAuth, register);
router.get("/me", requireAuth, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
