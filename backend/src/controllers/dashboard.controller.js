import Vehicle from "../models/vehicle.model.js";
import Shipment from "../models/shipment.model.js";

export async function getSummary(req, res, next) {
  try {
    const { type, status, region } = req.query;

    const vehicleFilter = {};
    if (type) {
      vehicleFilter.type = type;
    }
    if (status) {
      vehicleFilter.status = status;
    }
    if (region) {
      vehicleFilter.region = region;
    }

    const [totalFleet, activeFleet, maintenanceAlerts, idleFleet, pendingCargo] = await Promise.all([
      Vehicle.countDocuments(vehicleFilter),
      Vehicle.countDocuments({ ...vehicleFilter, status: "In Transit" }),
      Vehicle.countDocuments({ ...vehicleFilter, status: "Maintenance" }),
      Vehicle.countDocuments({ ...vehicleFilter, status: "Available" }),
      Shipment.countDocuments({ status: "Pending" }),
    ]);

    const utilizationRate = totalFleet === 0 ? 0 : Number(((activeFleet / totalFleet) * 100).toFixed(2));

    return res.status(200).json({
      summary: {
        activeFleet,
        maintenanceAlerts,
        utilizationRate,
        pendingCargo,
        totalFleet,
        idleFleet,
      },
    });
  } catch (error) {
    return next(error);
  }
}
