import { useEffect, useState } from "react";
import { getOdometerStats, getOdometerHistory, recordOdometerReading } from "../api";

export default function OdometerTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ vehicleId: "", odometerKm: "", recordType: "Manual Check", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  async function loadVehicles() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fleetflow_token")}`,
        },
      });
      const data = await response.json();
      setVehicles(data.items || []);
    } catch {
      setError("Failed to load vehicles");
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicleStats(vehicleId) {
    if (!vehicleId) return;

    setLoading(true);
    setError("");
    try {
      const [statsData, historyData] = await Promise.all([getOdometerStats(vehicleId), getOdometerHistory(vehicleId)]);

      setStats(statsData.stats);
      setHistory(historyData.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecordReading(e) {
    e.preventDefault();
    if (!form.vehicleId || !form.odometerKm) {
      setError("Vehicle and odometer reading are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await recordOdometerReading({
        vehicleId: form.vehicleId,
        odometerKm: parseFloat(form.odometerKm),
        recordType: form.recordType,
        notes: form.notes,
      });

      setForm({ vehicleId: form.vehicleId, odometerKm: "", recordType: "Manual Check", notes: "" });
      await loadVehicleStats(form.vehicleId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Odometer Tracking</h2>
          <p className="text-slate-400">Track vehicle mileage and distance</p>
        </div>
        <span className="text-lg font-bold px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg">
          {stats ? `📍 ${stats.currentOdometerKm} km` : "Select a vehicle"}
        </span>
      </div>

      <form className="mb-6 p-4 bg-slate-700/40 border border-slate-600 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRecordReading}>
        <div>
          <label className="label">Select Vehicle</label>
          <select
            value={form.vehicleId}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, vehicleId: e.target.value }));
              loadVehicleStats(e.target.value);
            }}
            required
            className="input"
          >
            <option value="">Choose a vehicle...</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vehicleNumber} ({v.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Odometer Reading (km)</label>
          <input
            type="number"
            value={form.odometerKm}
            onChange={(e) => setForm((prev) => ({ ...prev, odometerKm: e.target.value }))}
            placeholder="e.g., 45000"
            required
            className="input"
          />
        </div>

        <div>
          <label className="label">Record Type</label>
          <select
            value={form.recordType}
            onChange={(e) => setForm((prev) => ({ ...prev, recordType: e.target.value }))}
            className="input"
          >
            <option value="Trip End">Trip End</option>
            <option value="Trip Start">Trip Start</option>
            <option value="Manual Check">Manual Check</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="label">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes..."
            rows="1"
            className="input"
          />
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={submitting || !form.vehicleId} className="btn-primary">
            {submitting ? "💾 Recording..." : "📍 Record Reading"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-dark group hover:from-purple-500 hover:to-pink-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Current Odometer</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-purple-300">{stats.currentOdometerKm} km</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">🛣️</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-orange-500 hover:to-red-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Distance</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-orange-300">{stats.totalDistanceCoveredKm} km</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">📏</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-cyan-500 hover:to-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Readings</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-cyan-300">{stats.readingsCount}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">📊</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-center py-8">🔄 Loading history...</p>
      ) : history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-800/50">
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Odometer (km)</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Distance (km)</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((reading) => (
                <tr key={reading._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition duration-200">
                  <td className="px-4 py-3 text-sm text-slate-300">{new Date(reading.recordedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{reading.odometerKm}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{reading.distanceCoveredKm}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="badge badge-info">{reading.recordType}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{reading.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
