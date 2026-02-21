import Trip from "../models/trip.model.js";
import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Shipment from "../models/shipment.model.js";
import { calculateDriverSafetyScore } from "./safety-score.controller.js";

function isLicenseExpired(driver) {
  if (!driver?.licenseExpiryAt) {
    return false;
  }
  return new Date(driver.licenseExpiryAt).getTime() < Date.now();
}

async function validateAssignment({ vehicleId, driverId, shipmentId }) {
  const [vehicle, driver, shipment] = await Promise.all([
    Vehicle.findById(vehicleId),
    Driver.findById(driverId),
    Shipment.findById(shipmentId),
  ]);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  if (!driver) {
    throw new Error("Driver not found");
  }
  if (!shipment) {
    throw new Error("Shipment not found");
  }

  if (vehicle.status !== "Available") {
    throw new Error("Selected vehicle is not available for dispatch");
  }
  if (driver.status !== "Available") {
    throw new Error("Selected driver is not available for dispatch");
  }
  if (isLicenseExpired(driver)) {
    throw new Error("Driver license is expired and cannot be assigned");
  }
  if (shipment.weightKg > vehicle.capacityKg) {
    throw new Error("Cargo weight exceeds vehicle capacity");
  }

  return { vehicle, driver, shipment };
}

async function populateTripById(id) {
  return Trip.findById(id).populate("vehicle").populate("driver").populate("shipment");
}

async function list(req, res, next) {
  try {
    const items = await Trip.find()
      .populate("vehicle")
      .populate("driver")
      .populate("shipment")
      .sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await populateTripById(req.params.id);
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
    const requestedStatus = req.body.status || "Dispatched";

    if (requestedStatus === "Dispatched") {
      const { vehicle, driver, shipment } = await validateAssignment({
        vehicleId: req.body.vehicle,
        driverId: req.body.driver,
        shipmentId: req.body.shipment,
      });

      await Promise.all([
        Vehicle.findByIdAndUpdate(vehicle._id, { status: "In Transit" }),
        Driver.findByIdAndUpdate(driver._id, { status: "On Trip" }),
        Shipment.findByIdAndUpdate(shipment._id, { status: "In Transit" }),
      ]);
    }

    const item = await Trip.create({ ...req.body, status: requestedStatus });
    const populated = await populateTripById(item._id);
    res.status(201).json({ item: populated });
  } catch (error) {
    if (error.message.endsWith("not found") || error.message.includes("not available") || error.message.includes("exceeds") || error.message.includes("expired")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const existing = await Trip.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const previousStatus = existing.status;
    const nextStatus = req.body.status || previousStatus;

    if (previousStatus === "Dispatched" && ["vehicle", "driver", "shipment"].some((field) => field in req.body)) {
      return res.status(400).json({ message: "Cannot change vehicle, driver, or shipment on a dispatched trip" });
    }

    if (nextStatus === "Dispatched" && previousStatus !== "Dispatched") {
      const vehicleId = req.body.vehicle || existing.vehicle;
      const driverId = req.body.driver || existing.driver;
      const shipmentId = req.body.shipment || existing.shipment;

      await validateAssignment({ vehicleId, driverId, shipmentId });

      await Promise.all([
        Vehicle.findByIdAndUpdate(vehicleId, { status: "In Transit" }),
        Driver.findByIdAndUpdate(driverId, { status: "On Trip" }),
        Shipment.findByIdAndUpdate(shipmentId, { status: "In Transit" }),
      ]);
    }

    if (previousStatus === "Dispatched" && ["Completed", "Cancelled"].includes(nextStatus)) {
      const vehicle = await Vehicle.findById(existing.vehicle);

      const updates = [];
      if (vehicle && vehicle.status !== "Maintenance") {
        updates.push(Vehicle.findByIdAndUpdate(existing.vehicle, { status: "Available" }));
      }
      updates.push(Driver.findByIdAndUpdate(existing.driver, { status: "Available" }));
      updates.push(
        Shipment.findByIdAndUpdate(existing.shipment, {
          status: nextStatus === "Completed" ? "Delivered" : "Cancelled",
        })
      );

      await Promise.all(updates);

      // Recalculate driver safety score when trip completes
      if (nextStatus === "Completed") {
        try {
          await calculateDriverSafetyScore(existing.driver);
        } catch (err) {
          console.error("Error calculating safety score:", err.message);
          // Don't block trip completion if score calculation fails
        }
      }
    }

    const item = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("vehicle")
      .populate("driver")
      .populate("shipment");

    res.status(200).json({ item });
  } catch (error) {
    if (error.message.endsWith("not found") || error.message.includes("not available") || error.message.includes("exceeds") || error.message.includes("expired")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const item = await Trip.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (item.status === "Dispatched") {
      await Promise.all([
        Vehicle.findByIdAndUpdate(item.vehicle, { status: "Available" }),
        Driver.findByIdAndUpdate(item.driver, { status: "Available" }),
      ]);
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const tripController = { list, getById, create, update, remove };
