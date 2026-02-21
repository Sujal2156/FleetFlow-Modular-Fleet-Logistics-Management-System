# FleetFlow - MERN Stack Fleet Management System

A complete fleet logistics management system built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🚛 **Vehicle Management** - Track and manage fleet vehicles
- 👨‍✈️ **Driver Management** - Manage driver information and assignments
- 🛣️ **Trip Management** - Log and monitor trips
- 🔧 **Maintenance Logs** - Track vehicle maintenance and repairs
- 💰 **Expense Tracking** - Monitor fleet operational costs
- 📊 **Analytics Dashboard** - Real-time fleet statistics

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS enabled

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Vite for build tooling

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
cd FleetFlow-Modular-Fleet-Logistics-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:id` - Get single record
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Project Structure

```
FleetFlow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Vehicle.model.js
│   │   ├── Driver.model.js
│   │   ├── Trip.model.js
│   │   ├── Maintenance.model.js
│   │   └── Expense.model.js
│   ├── routes/
│   │   ├── vehicle.routes.js
│   │   ├── driver.routes.js
│   │   ├── trip.routes.js
│   │   ├── maintenance.routes.js
│   │   └── expense.routes.js
│   ├── controllers/
│   │   ├── vehicle.controller.js
│   │   ├── driver.controller.js
│   │   ├── trip.controller.js
│   │   ├── maintenance.controller.js
│   │   └── expense.controller.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── Drivers.jsx
│   │   │   ├── Trips.jsx
│   │   │   ├── Maintenance.jsx
│   │   │   └── Expenses.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.
