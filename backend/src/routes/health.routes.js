import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FleetFlow Backend",
  });
});

export default router;
