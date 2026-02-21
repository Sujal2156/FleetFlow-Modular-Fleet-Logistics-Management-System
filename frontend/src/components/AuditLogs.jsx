import { useEffect, useState } from "react";
import { listAuditLogs, getSafetyDashboard } from "../api";

function getSeverityBadge(severity) {
  switch (severity) {
    case "LOW":
      return "bg-green-600/20 text-green-300 border border-green-500/30";
    case "MEDIUM":
      return "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30";
    case "HIGH":
      return "bg-orange-600/20 text-orange-300 border border-orange-500/30";
    case "CRITICAL":
      return "bg-red-600/20 text-red-300 border border-red-500/30";
    default:
      return "bg-slate-600/20 text-slate-300 border border-slate-500/30";
  }
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ action: "", severity: "" });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [logsData, dashboardData] = await Promise.all([listAuditLogs(filters), getSafetyDashboard()]);

        setLogs(logsData.items || []);
        setDashboard(dashboardData.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filters.action, filters.severity]);

  const actionOptions = [
    "DRIVER_LICENSE_EXPIRED",
    "DRIVER_SAFETY_SCORE_UPDATED",
    "VEHICLE_MAINTENANCE_LOGGED",
    "TRIP_CANCELLED_HIGH_RISK",
    "INCIDENT_REPORTED",
    "COMPLIANCE_VIOLATION_DETECTED",
    "USER_CREATED",
    "PASSWORD_RESET",
  ];

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Audit & Safety Logs</h2>
          <p className="text-slate-400">System compliance and security tracking</p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-full ${
          loading ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"
        }`}>
          {loading ? "🔄 Refreshing..." : "✅ Live"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="label">Action</label>
          <select value={filters.action} onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))} className="input">
            <option value="">All Actions</option>
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {action.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Severity</label>
          <select value={filters.severity} onChange={(e) => setFilters((prev) => ({ ...prev, severity: e.target.value }))} className="input">
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-dark group hover:from-red-500 hover:to-pink-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">🚨 Critical Alerts (30d)</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-red-300">{dashboard.criticalAlerts}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">⚠️</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-orange-500 hover:to-yellow-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">⚖️ Violations</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-orange-300">{dashboard.complianceViolations}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">⚖️</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-yellow-500 hover:to-amber-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">📋 Incidents</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-yellow-300">{dashboard.driverIncidents}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">🚗</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-blue-500 hover:to-indigo-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">🔧 Maintenance</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-blue-300">{dashboard.maintenanceIssues}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">🔧</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-center py-8">🔄 Loading audit logs...</p>
      ) : logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-800/50">
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Action</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Severity</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition duration-200">
                  <td className="px-4 py-3 text-sm text-slate-300">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{log.action.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{log.user?.fullName || log.userRole || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">📭 No audit logs found</p>
      )}
    </section>
  );
}
