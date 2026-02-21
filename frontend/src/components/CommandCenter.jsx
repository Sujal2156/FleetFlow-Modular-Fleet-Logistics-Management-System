import { useEffect, useMemo, useState } from "react";
import { getDashboardSummary } from "../api";

const vehicleTypeOptions = ["", "Truck", "Van", "Mini Truck", "Container", "Other"];
const vehicleStatusOptions = ["", "Available", "In Transit", "Maintenance", "Inactive"];

export default function CommandCenter() {
  const [filters, setFilters] = useState({ type: "", status: "", region: "" });
  const [summary, setSummary] = useState({
    activeFleet: 0,
    maintenanceAlerts: 0,
    utilizationRate: 0,
    pendingCargo: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cards = useMemo(
    () => [
      { label: "Active Fleet", value: summary.activeFleet },
      { label: "Maintenance Alerts", value: summary.maintenanceAlerts },
      { label: "Utilization Rate", value: `${summary.utilizationRate}%` },
      { label: "Pending Cargo", value: summary.pendingCargo },
    ],
    [summary]
  );

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError("");
      try {
        const response = await getDashboardSummary(filters);
        setSummary(response.summary || summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [filters.type, filters.status, filters.region]);

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Command Center</h2>
          <p className="text-slate-400">Real-time fleet operations overview</p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-full ${
          loading ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"
        }`}>
          {loading ? "🔄 Refreshing..." : "✅ Live"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="label">Vehicle Type</label>
          <select
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
            className="input"
          >
            {vehicleTypeOptions.map((option) => (
              <option key={option || "all"} value={option}>
                {option || "All Types"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Status Filter</label>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="input"
          >
            {vehicleStatusOptions.map((option) => (
              <option key={option || "all"} value={option}>
                {option || "All Status"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Region</label>
          <input
            value={filters.region}
            onChange={(event) => setFilters((prev) => ({ ...prev, region: event.target.value }))}
            className="input"
            placeholder="Search region..."
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className="card-dark group hover:from-blue-500 hover:to-purple-600 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{card.label}</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-blue-300">{card.value}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">📊</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
