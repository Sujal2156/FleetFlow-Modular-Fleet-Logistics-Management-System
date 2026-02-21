import { useEffect, useState } from "react";
import AnalyticsPanel from "./components/AnalyticsPanel";
import CommandCenter from "./components/CommandCenter";
import ResourceSection from "./components/ResourceSection";
import OdometerTracking from "./components/OdometerTracking";
import SafetyScores from "./components/SafetyScores";
import AuditLogs from "./components/AuditLogs";
import { login, me, register } from "./api";
import "./App.css";

const fleetModules = [
  {
    key: "vehicles",
    title: "Vehicles",
    endpoint: "/vehicles",
    fields: [
      { name: "vehicleNumber", label: "Vehicle Number", required: true },
      {
        name: "type",
        label: "Type",
        required: true,
        options: ["Truck", "Van", "Mini Truck", "Container", "Other"],
      },
      { name: "capacityKg", label: "Capacity (kg)", type: "number", required: true },
      { name: "acquisitionCost", label: "Acquisition Cost", type: "number" },
      { name: "region", label: "Region" },
      {
        name: "status",
        label: "Status",
        options: ["Available", "In Transit", "Maintenance", "Inactive"],
      },
    ],
    columns: [
      { key: "vehicleNumber", label: "Vehicle Number" },
      { key: "type", label: "Type" },
      { key: "capacityKg", label: "Capacity (kg)" },
      { key: "acquisitionCost", label: "Acquisition Cost" },
      { key: "region", label: "Region" },
      { key: "status", label: "Status" },
    ],
  },
  {
    key: "drivers",
    title: "Drivers",
    endpoint: "/drivers",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "phone", label: "Phone", required: true },
      { name: "licenseNumber", label: "License Number", required: true },
      { name: "licenseExpiryAt", label: "License Expiry", type: "datetime-local" },
      {
        name: "status",
        label: "Status",
        options: ["Available", "On Trip", "Off Duty", "Suspended", "Inactive"],
      },
    ],
    columns: [
      { key: "_id", label: "Driver ID" },
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "licenseNumber", label: "License Number" },
      { key: "licenseExpiryAt", label: "License Expiry" },
      { key: "status", label: "Status" },
    ],
  },
  {
    key: "shipments",
    title: "Shipments",
    endpoint: "/shipments",
    fields: [
      { name: "referenceId", label: "Reference ID", required: true },
      { name: "customerName", label: "Customer Name", required: true },
      { name: "origin", label: "Origin", required: true },
      { name: "destination", label: "Destination", required: true },
      { name: "weightKg", label: "Weight (kg)", type: "number", required: true },
      {
        name: "status",
        label: "Status",
        options: ["Pending", "Assigned", "In Transit", "Delivered", "Cancelled"],
      },
    ],
    columns: [
      { key: "referenceId", label: "Reference ID" },
      { key: "customerName", label: "Customer" },
      { key: "origin", label: "Origin" },
      { key: "destination", label: "Destination" },
      { key: "status", label: "Status" },
    ],
  },
  {
    key: "trips",
    title: "Trips",
    endpoint: "/trips",
    fields: [
      { name: "tripCode", label: "Trip Code", required: true },
      { name: "vehicle", label: "Vehicle", required: true, sourceEndpoint: "/vehicles" },
      { name: "driver", label: "Driver", required: true, sourceEndpoint: "/drivers" },
      { name: "shipment", label: "Shipment", required: true, sourceEndpoint: "/shipments" },
      { name: "plannedStartAt", label: "Planned Start", type: "datetime-local", required: true },
      { name: "plannedEndAt", label: "Planned End", type: "datetime-local", required: true },
      { name: "distanceKm", label: "Distance (km)", type: "number" },
      { name: "revenue", label: "Revenue", type: "number" },
      {
        name: "status",
        label: "Status",
        options: ["Draft", "Dispatched", "Completed", "Cancelled"],
      },
    ],
    columns: [
      { key: "tripCode", label: "Trip Code" },
      { key: "vehicle", label: "Vehicle" },
      { key: "driver", label: "Driver" },
      { key: "shipment", label: "Shipment" },
      { key: "distanceKm", label: "Distance" },
      { key: "revenue", label: "Revenue" },
      { key: "status", label: "Status" },
    ],
  },
  {
    key: "maintenance",
    title: "Maintenance Logs",
    endpoint: "/maintenance",
    fields: [
      { name: "logId", label: "Log ID", required: true },
      { name: "vehicle", label: "Vehicle", required: true, sourceEndpoint: "/vehicles" },
      { name: "issueService", label: "Issue/Service", required: true },
      { name: "serviceDate", label: "Service Date", type: "datetime-local", required: true },
      { name: "cost", label: "Cost", type: "number", required: true },
      {
        name: "status",
        label: "Status",
        options: ["Open", "In Progress", "Completed"],
      },
    ],
    columns: [
      { key: "logId", label: "Log ID" },
      { key: "vehicle", label: "Vehicle" },
      { key: "issueService", label: "Issue/Service" },
      { key: "serviceDate", label: "Date" },
      { key: "cost", label: "Cost" },
      { key: "status", label: "Status" },
    ],
  },
  {
    key: "expenses",
    title: "Trip Expenses",
    endpoint: "/expenses",
    fields: [
      { name: "expenseId", label: "Expense ID", required: true },
      { name: "trip", label: "Trip", required: true, sourceEndpoint: "/trips" },
      { name: "vehicle", label: "Vehicle", required: true, sourceEndpoint: "/vehicles" },
      { name: "driver", label: "Driver", required: true, sourceEndpoint: "/drivers" },
      { name: "fuelLiters", label: "Fuel (L)", type: "number", required: true },
      { name: "fuelCost", label: "Fuel Cost", type: "number", required: true },
      { name: "miscExpense", label: "Misc Expense", type: "number" },
      { name: "expenseDate", label: "Expense Date", type: "datetime-local", required: true },
    ],
    columns: [
      { key: "expenseId", label: "Expense ID" },
      { key: "trip", label: "Trip" },
      { key: "vehicle", label: "Vehicle" },
      { key: "driver", label: "Driver" },
      { key: "fuelCost", label: "Fuel Cost" },
      { key: "miscExpense", label: "Misc" },
      { key: "totalOperationalCost", label: "Total Cost" },
    ],
  },
];

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "", role: "Dispatcher" });
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    async function bootstrapAuth() {
      const token = localStorage.getItem("fleetflow_token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await me();
        setAuthUser(response.user);
      } catch {
        localStorage.removeItem("fleetflow_token");
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError("");

    try {
      const payload =
        authMode === "register"
          ? {
              fullName: authForm.fullName,
              email: authForm.email,
              password: authForm.password,
              role: authForm.role,
            }
          : {
              email: authForm.email,
              password: authForm.password,
            };

      const response = authMode === "register" ? await register(payload) : await login(payload);

      localStorage.setItem("fleetflow_token", response.token);
      setAuthUser(response.user);
      setAuthForm({ fullName: "", email: "", password: "", role: "Dispatcher" });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("fleetflow_token");
    setAuthUser(null);
    setAuthError("");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
              <h1 className="text-3xl font-bold text-white mb-2">🚚 FleetFlow</h1>
              <p className="text-blue-100">Fleet & Logistics Management System</p>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    authMode === "login"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    authMode === "register"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="••••••••"
                  />
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Role</label>
                    <select
                      value={authForm.role}
                      onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                      className="auth-select w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Dispatcher">Dispatcher</option>
                      <option value="Manager">Manager</option>
                      <option value="Safety Officer">Safety Officer</option>
                    </select>
                  </div>
                )}

                {authError && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{authError}</p>}

                <button type="submit" disabled={authSubmitting} className="btn-primary w-full">
                  {authSubmitting ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              {authMode === "login" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-slate-700">
                  <p className="font-semibold mb-2">Demo Credentials:</p>
                  <p className="mb-1"><strong>Manager:</strong> manager@fleetflow.local / Manager@123</p>
                  <p><strong>Dispatcher:</strong> dispatcher@fleetflow.local / Dispatch@123</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <span className="text-3xl">🚚</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">FleetFlow</h1>
                <p className="text-blue-100 text-xs sm:text-sm">Advanced Fleet Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{authUser.fullName}</p>
                <p className="text-xs text-blue-200">{authUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 bg-slate-800 bg-opacity-50 backdrop-blur-xl border-r border-slate-700 min-h-screen p-6 sticky top-16">
          <nav className="space-y-3">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "vehicles", label: "Vehicles", icon: "🚗" },
              { id: "drivers", label: "Drivers", icon: "👥" },
              { id: "shipments", label: "Shipments", icon: "📦" },
              { id: "trips", label: "Trips", icon: "🗺️" },
              { id: "maintenance", label: "Maintenance", icon: "🔧" },
              { id: "expenses", label: "Expenses", icon: "💰" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "odometer", label: "Odometer", icon: "🛣️" },
              { id: "safety", label: "Safety Scores", icon: "⚠️" },
              { id: "audit", label: "Audit Logs", icon: "🔐" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white hover:translate-x-2"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setCurrentPage(currentPage === "menu" ? "dashboard" : "menu")}
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110"
          >
            ☰
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full">
          {/* Dashboard Page */}
          {currentPage === "dashboard" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">Welcome Back! 👋</h2>
                <p className="text-slate-400">Manage your fleet with real-time insights</p>
              </div>
              <CommandCenter />
              <AnalyticsPanel />
            </div>
          )}

          {/* Resources Pages */}
          {currentPage === "vehicles" && (
            <ResourceSection
              title="🚗 Vehicle Fleet"
              endpoint="/vehicles"
              fields={fleetModules[0].fields}
              columns={fleetModules[0].columns}
            />
          )}

          {currentPage === "drivers" && (
            <ResourceSection
              title="👥 Driver Management"
              endpoint="/drivers"
              fields={fleetModules[1].fields}
              columns={fleetModules[1].columns}
            />
          )}

          {currentPage === "shipments" && (
            <ResourceSection
              title="📦 Shipment Tracking"
              endpoint="/shipments"
              fields={fleetModules[2].fields}
              columns={fleetModules[2].columns}
            />
          )}

          {currentPage === "trips" && (
            <ResourceSection
              title="🗺️ Trip Dispatcher"
              endpoint="/trips"
              fields={fleetModules[3].fields}
              columns={fleetModules[3].columns}
            />
          )}

          {currentPage === "maintenance" && (
            <ResourceSection
              title="🔧 Maintenance Logs"
              endpoint="/maintenance"
              fields={fleetModules[4].fields}
              columns={fleetModules[4].columns}
            />
          )}

          {currentPage === "expenses" && (
            <ResourceSection
              title="💰 Expense Tracking"
              endpoint="/expenses"
              fields={fleetModules[5].fields}
              columns={fleetModules[5].columns}
            />
          )}

          {currentPage === "analytics" && <AnalyticsPanel />}
          {currentPage === "odometer" && <OdometerTracking />}
          {currentPage === "safety" && <SafetyScores />}
          {currentPage === "audit" && <AuditLogs />}
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;
