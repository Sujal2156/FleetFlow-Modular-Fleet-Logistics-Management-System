import PDFDocument from "pdfkit";
import Vehicle from "../models/vehicle.model.js";
import Trip from "../models/trip.model.js";
import Expense from "../models/expense.model.js";
import Maintenance from "../models/maintenance.model.js";

async function buildAnalyticsSummary() {
  const [vehicles, trips, expenses, maintenanceLogs] = await Promise.all([
    Vehicle.find().select("_id acquisitionCost status"),
    Trip.find().select("vehicle distanceKm revenue status createdAt"),
    Expense.find().select("vehicle fuelLiters fuelCost miscExpense"),
    Maintenance.find().select("vehicle cost"),
  ]);

  const totalDistanceKm = trips.reduce((sum, trip) => sum + Number(trip.distanceKm || 0), 0);
  const totalFuelLiters = expenses.reduce((sum, item) => sum + Number(item.fuelLiters || 0), 0);
  const fuelEfficiencyKmPerLiter = totalFuelLiters === 0 ? 0 : Number((totalDistanceKm / totalFuelLiters).toFixed(2));

  const totalFuelCost = expenses.reduce((sum, item) => sum + Number(item.fuelCost || 0), 0);
  const totalMiscExpense = expenses.reduce((sum, item) => sum + Number(item.miscExpense || 0), 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
  const totalOperationalCost = totalFuelCost + totalMiscExpense + totalMaintenanceCost;

  const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue || 0), 0);
  const totalAcquisitionCost = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.acquisitionCost || 0), 0);
  const fleetRoiPercent =
    totalAcquisitionCost === 0
      ? 0
      : Number((((totalRevenue - totalOperationalCost) / totalAcquisitionCost) * 100).toFixed(2));

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentlyUsedVehicleIds = new Set(
    trips
      .filter((trip) => trip.createdAt >= last30Days && ["Dispatched", "Completed"].includes(trip.status))
      .map((trip) => String(trip.vehicle))
  );

  const deadStockAlerts = vehicles.filter(
    (vehicle) => vehicle.status !== "In Transit" && !recentlyUsedVehicleIds.has(String(vehicle._id))
  ).length;

  return {
    fuelEfficiencyKmPerLiter,
    fleetRoiPercent,
    deadStockAlerts,
    totalDistanceKm,
    totalFuelLiters,
    totalRevenue,
    totalFuelCost,
    totalMaintenanceCost,
    totalOperationalCost,
  };
}

export async function getAnalyticsSummary(req, res, next) {
  try {
    const summary = await buildAnalyticsSummary();
    return res.status(200).json({ summary });
  } catch (error) {
    return next(error);
  }
}

export async function exportAnalytics(req, res, next) {
  try {
    const format = (req.query.format || "csv").toLowerCase();
    const summary = await buildAnalyticsSummary();

    if (format === "csv") {
      const rows = [
        ["metric", "value"],
        ["fuelEfficiencyKmPerLiter", summary.fuelEfficiencyKmPerLiter],
        ["fleetRoiPercent", summary.fleetRoiPercent],
        ["deadStockAlerts", summary.deadStockAlerts],
        ["totalDistanceKm", summary.totalDistanceKm],
        ["totalFuelLiters", summary.totalFuelLiters],
        ["totalRevenue", summary.totalRevenue],
        ["totalFuelCost", summary.totalFuelCost],
        ["totalMaintenanceCost", summary.totalMaintenanceCost],
        ["totalOperationalCost", summary.totalOperationalCost],
      ];

      const csv = rows.map((row) => row.join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="fleetflow-analytics-${Date.now()}.csv"`);
      return res.status(200).send(csv);
    }

    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="fleetflow-analytics-${Date.now()}.pdf"`);
        res.status(200).send(pdfBuffer);
      });

      doc.fontSize(20).text("FleetFlow Analytics Report");
      doc.moveDown();
      doc.fontSize(12).text(`Generated: ${new Date().toISOString()}`);
      doc.moveDown();
      doc.text(`Fuel Efficiency (km/L): ${summary.fuelEfficiencyKmPerLiter}`);
      doc.text(`Fleet ROI (%): ${summary.fleetRoiPercent}`);
      doc.text(`Dead Stock Alerts: ${summary.deadStockAlerts}`);
      doc.text(`Total Distance (km): ${summary.totalDistanceKm}`);
      doc.text(`Total Fuel (L): ${summary.totalFuelLiters}`);
      doc.text(`Total Revenue: ${summary.totalRevenue}`);
      doc.text(`Total Fuel Cost: ${summary.totalFuelCost}`);
      doc.text(`Total Maintenance Cost: ${summary.totalMaintenanceCost}`);
      doc.text(`Total Operational Cost: ${summary.totalOperationalCost}`);
      doc.end();
      return;
    }

    return res.status(400).json({ message: "Invalid format. Use csv or pdf" });
  } catch (error) {
    return next(error);
  }
}
