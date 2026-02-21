import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Shipment from "../models/shipment.model.js";
import Trip from "../models/trip.model.js";
import Expense from "../models/expense.model.js";
import Maintenance from "../models/maintenance.model.js";

dotenv.config();

async function seed() {
  await connectDatabase();

  await Promise.all([
    Expense.deleteMany({}),
    Maintenance.deleteMany({}),
    Trip.deleteMany({}),
    Shipment.deleteMany({}),
    Driver.deleteMany({}),
    Vehicle.deleteMany({}),
    User.deleteMany({}),
  ]);

  const managerPasswordHash = await bcrypt.hash("Manager@123", 10);
  const dispatcherPasswordHash = await bcrypt.hash("Dispatcher@123", 10);
  const safetyPasswordHash = await bcrypt.hash("Safety@123", 10);

  const [manager, dispatcher, safetyOfficer] = await User.create([
    {
      fullName: "Fleet Manager",
      email: "manager@fleetflow.local",
      passwordHash: managerPasswordHash,
      role: "Manager",
    },
    {
      fullName: "Main Dispatcher",
      email: "dispatcher@fleetflow.local",
      passwordHash: dispatcherPasswordHash,
      role: "Dispatcher",
    },
    {
      fullName: "Safety Officer",
      email: "safety@fleetflow.local",
      passwordHash: safetyPasswordHash,
      role: "Safety Officer",
    },
  ]);

  const [v1, v2, v3, v4, v5] = await Vehicle.create([
    {
      vehicleNumber: "TRK-1001",
      type: "Truck",
      capacityKg: 5000,
      acquisitionCost: 2800000,
      region: "North",
      status: "In Transit",
    },
    {
      vehicleNumber: "VAN-2001",
      type: "Van",
      capacityKg: 1200,
      acquisitionCost: 1200000,
      region: "West",
      status: "Maintenance",
    },
    {
      vehicleNumber: "CNT-3001",
      type: "Container",
      capacityKg: 9000,
      acquisitionCost: 3600000,
      region: "South",
      status: "Available",
    },
    {
      vehicleNumber: "MIN-4001",
      type: "Mini Truck",
      capacityKg: 1800,
      acquisitionCost: 950000,
      region: "North",
      status: "Available",
    },
    {
      vehicleNumber: "VAN-5001",
      type: "Van",
      capacityKg: 1000,
      acquisitionCost: 800000,
      region: "East",
      status: "Inactive",
    },
  ]);

  const [d1, d2, d3, d4] = await Driver.create([
    {
      name: "Alex Turner",
      phone: "9000000001",
      licenseNumber: "LIC-AX-1001",
      licenseExpiryAt: new Date("2027-12-31"),
      status: "On Trip",
    },
    {
      name: "Riya Nair",
      phone: "9000000002",
      licenseNumber: "LIC-RN-1002",
      licenseExpiryAt: new Date("2027-11-30"),
      status: "Available",
    },
    {
      name: "Sam Paul",
      phone: "9000000003",
      licenseNumber: "LIC-SP-1003",
      licenseExpiryAt: new Date("2025-05-01"),
      status: "Suspended",
    },
    {
      name: "Karan Iyer",
      phone: "9000000004",
      licenseNumber: "LIC-KI-1004",
      licenseExpiryAt: new Date("2028-03-10"),
      status: "Off Duty",
    },
  ]);

  const [s1, s2, s3, s4] = await Shipment.create([
    {
      referenceId: "SHP-1001",
      customerName: "Nova Retail",
      origin: "Delhi",
      destination: "Jaipur",
      weightKg: 900,
      status: "Pending",
    },
    {
      referenceId: "SHP-1002",
      customerName: "Axis Foods",
      origin: "Pune",
      destination: "Nashik",
      weightKg: 1500,
      status: "In Transit",
    },
    {
      referenceId: "SHP-1003",
      customerName: "Metro Build",
      origin: "Chennai",
      destination: "Bengaluru",
      weightKg: 2100,
      status: "Delivered",
    },
    {
      referenceId: "SHP-1004",
      customerName: "QuickMed",
      origin: "Mumbai",
      destination: "Surat",
      weightKg: 700,
      status: "Cancelled",
    },
  ]);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [t1, t2, t3] = await Trip.create([
    {
      tripCode: "TRP-1001",
      vehicle: v1._id,
      driver: d1._id,
      shipment: s2._id,
      plannedStartAt: new Date(),
      plannedEndAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      distanceKm: 180,
      revenue: 23000,
      status: "Dispatched",
    },
    {
      tripCode: "TRP-1002",
      vehicle: v3._id,
      driver: d2._id,
      shipment: s3._id,
      plannedStartAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      plannedEndAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      distanceKm: 420,
      revenue: 48000,
      status: "Completed",
    },
    {
      tripCode: "TRP-0901",
      vehicle: v5._id,
      driver: d4._id,
      shipment: s4._id,
      plannedStartAt: sixtyDaysAgo,
      plannedEndAt: sixtyDaysAgo,
      distanceKm: 95,
      revenue: 6000,
      status: "Completed",
      createdAt: sixtyDaysAgo,
      updatedAt: sixtyDaysAgo,
    },
  ]);

  await Expense.create([
    {
      expenseId: "EXP-1001",
      trip: t1._id,
      vehicle: v1._id,
      driver: d1._id,
      fuelLiters: 38,
      fuelCost: 3800,
      miscExpense: 450,
      expenseDate: new Date(),
    },
    {
      expenseId: "EXP-1002",
      trip: t2._id,
      vehicle: v3._id,
      driver: d2._id,
      fuelLiters: 54,
      fuelCost: 5400,
      miscExpense: 600,
      expenseDate: new Date(),
    },
    {
      expenseId: "EXP-0901",
      trip: t3._id,
      vehicle: v5._id,
      driver: d4._id,
      fuelLiters: 16,
      fuelCost: 1600,
      miscExpense: 200,
      expenseDate: sixtyDaysAgo,
      createdAt: sixtyDaysAgo,
      updatedAt: sixtyDaysAgo,
    },
  ]);

  await Maintenance.create([
    {
      logId: "MNT-1001",
      vehicle: v2._id,
      issueService: "Engine oil + brake inspection",
      serviceDate: new Date(),
      cost: 3200,
      status: "Open",
    },
  ]);

  console.log("Seed complete");
  console.log(`Manager login: manager@fleetflow.local / Manager@123`);
  console.log(`Dispatcher login: dispatcher@fleetflow.local / Dispatcher@123`);
  console.log(`Safety Officer login: safety@fleetflow.local / Safety@123`);
  console.log(`Created users: ${manager.email}, ${dispatcher.email}, ${safetyOfficer.email}`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
