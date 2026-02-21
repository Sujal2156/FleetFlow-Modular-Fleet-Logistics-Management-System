import { Router } from "express";
import { expenseController } from "../controllers/expense.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", expenseController.list);
router.get("/:id", expenseController.getById);
router.post("/", requireRole("Manager"), expenseController.create);
router.put("/:id", requireRole("Manager"), expenseController.update);
router.delete("/:id", requireRole("Manager"), expenseController.remove);

export default router;
