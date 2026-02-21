import Maintenance from "../models/maintenance.model.js";
import Vehicle from "../models/vehicle.model.js";

async function list(req, res, next) {
  try {
    const items = await Maintenance.find().populate("vehicle").sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await Maintenance.findById(req.params.id).populate("vehicle");
    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) {
      return res.status(400).json({ message: "Vehicle not found" });
    }
    if (vehicle.status === "In Transit") {
      return res.status(400).json({ message: "Cannot put an in-transit vehicle into maintenance" });
    }

    const item = await Maintenance.create(req.body);
    await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: "Maintenance" });

    const populated = await Maintenance.findById(item._id).populate("vehicle");
    res.status(201).json({ item: populated });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("vehicle");

    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (item.status === "Completed") {
      await Vehicle.findByIdAndUpdate(item.vehicle._id, { status: "Available" });
    } else {
      await Vehicle.findByIdAndUpdate(item.vehicle._id, { status: "Maintenance" });
    }

    const refreshed = await Maintenance.findById(item._id).populate("vehicle");
    res.status(200).json({ item: refreshed });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const item = await Maintenance.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const openLogsCount = await Maintenance.countDocuments({
      vehicle: item.vehicle,
      status: { $ne: "Completed" },
    });

    if (openLogsCount === 0) {
      await Vehicle.findByIdAndUpdate(item.vehicle, { status: "Available" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const maintenanceController = { list, getById, create, update, remove };
