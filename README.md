# FleetFlow Modular Fleet & Logistics Management System (MERN)

FleetFlow is a full-stack MERN application for managing logistics operations:

- **MongoDB** for data storage
- **Express.js** + **Node.js** for backend APIs
- **React (Vite)** for frontend dashboard UI

## Modules

- Vehicles
- Drivers
- Shipments
- Trips
- Maintenance Logs
- Trip Expenses

Each module supports CRUD operations through REST endpoints and a connected React UI.

## Project Structure

```text
backend/   -> Express + Mongoose API
frontend/  -> React + Vite client
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally or a MongoDB Atlas connection string

## 1) Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Set `MONGO_URI` in `backend/.env` if you are not using local MongoDB.

Run backend:

```bash
npm run dev
```

Seed demo data (optional, recommended for KPI/analytics screens):

```bash
npm run seed
```

Backend starts at: `http://localhost:5000`

Health check:

```bash
GET http://localhost:5000/api/health
```

## 2) Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend starts at: `http://localhost:5173`

Demo credentials after seeding:

- Manager: `manager@fleetflow.local` / `Manager@123`
- Dispatcher: `dispatcher@fleetflow.local` / `Dispatch@123`

## API Endpoints

- `GET/POST /api/vehicles`
- `GET/PUT/DELETE /api/vehicles/:id`
- `GET/POST /api/drivers`
- `GET/PUT/DELETE /api/drivers/:id`
- `GET/POST /api/shipments`
- `GET/PUT/DELETE /api/shipments/:id`
- `GET/POST /api/trips`
- `GET/PUT/DELETE /api/trips/:id`
- `GET/POST /api/maintenance`
- `GET/PUT/DELETE /api/maintenance/:id`
- `GET/POST /api/expenses`
- `GET/PUT/DELETE /api/expenses/:id`
- `GET /api/dashboard/summary`
- `GET /api/analytics/summary`
- `GET /api/analytics/export?format=csv`
- `GET /api/analytics/export?format=pdf`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

## Notes

- Trip creation requires valid MongoDB ObjectIds for `vehicle`, `driver`, and `shipment`.
- Dispatch validation blocks trip creation when `shipment.weightKg` exceeds vehicle capacity.
- Dispatch validation blocks assignment when driver license is expired or vehicle/driver is unavailable.
- Creating a maintenance log automatically marks the vehicle as `Maintenance`.
- Completing a maintenance log automatically restores the vehicle to `Available`.
- Trips are returned with populated references in list/get APIs.
- All business endpoints require JWT authentication.
- Role model: `Manager`, `Dispatcher`.
- First registered account is automatically promoted to `Manager`.
- Command Center supports filters by `type`, `status`, and `region` through query params.
- Analytics panel includes fuel efficiency, fleet ROI, dead-stock alerts, and operational cost.
- One-click exports are available as CSV and PDF for manager users.

## Reference Checklist (Step-by-Step)

- [x] Vehicle/Driver/Shipment/Trip CRUD base modules
- [x] Dispatch business rules (availability + load capacity + license compliance)
- [x] Maintenance logs with vehicle status automation
- [x] Expense & fuel logging module with total operational cost field
- [x] Authentication + role-based access (Manager/Dispatcher)
- [x] Command-center KPI dashboard (active fleet, utilization, pending cargo)
- [x] Analytics exports (CSV/PDF) and ROI/fuel efficiency reports
