import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import vehiclesRouter from "./routes/vehicles.routes.js";
import driversRouter from "./routes/drivers.routes.js";
import shipmentsRouter from "./routes/shipments.routes.js";
import tripsRouter from "./routes/trips.routes.js";
import maintenanceRouter from "./routes/maintenance.routes.js";
import expensesRouter from "./routes/expenses.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import auditRouter from "./routes/audit.routes.js";
import odometerRouter from "./routes/odometer.routes.js";
import safetyScoreRouter from "./routes/safety-score.routes.js";
import { requireAuth, requireRole } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/vehicles", requireAuth, vehiclesRouter);
app.use("/api/drivers", requireAuth, driversRouter);
app.use("/api/shipments", requireAuth, shipmentsRouter);
app.use("/api/trips", requireAuth, tripsRouter);
app.use("/api/maintenance", requireAuth, maintenanceRouter);
app.use("/api/expenses", requireAuth, expensesRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);
app.use("/api/analytics", requireAuth, requireRole("Manager"), analyticsRouter);
app.use("/api/audit", auditRouter);
app.use("/api/odometer", odometerRouter);
app.use("/api/safety-scores", safetyScoreRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
	let statusCode = 500;
	let message = error.message || "Internal server error";

	if (error.name === "ValidationError" || error.name === "CastError") {
		statusCode = 400;
	}

	if (error.code === 11000) {
		statusCode = 409;
		const fieldName = Object.keys(error.keyPattern || {})[0];
		message = fieldName ? `${fieldName} already exists` : "Duplicate value already exists";
	}

	res.status(statusCode).json({ message });
});

export default app;
