import { useEffect, useState } from "react";
import { listSafetyScores, getSafetyScoreSummary } from "../api";

function getRiskBadge(riskLevel) {
  switch (riskLevel) {
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

export default function SafetyScores() {
  const [scores, setScores] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ riskLevel: "", licenseStatus: "" });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [scoresData, summaryData] = await Promise.all([listSafetyScores(filters), getSafetyScoreSummary()]);

        setScores(scoresData.items || []);
        setSummary(summaryData.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filters.riskLevel, filters.licenseStatus]);

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Driver Safety Scores</h2>
          <p className="text-slate-400">Monitor driver performance and risk levels</p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-full ${
          loading ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"
        }`}>
          {loading ? "🔄 Refreshing..." : "✅ Live"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="label">Risk Level Filter</label>
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))}
            className="input"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label className="label">License Status</label>
          <select
            value={filters.licenseStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, licenseStatus: e.target.value }))}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="Valid">Valid</option>
            <option value="Expired Soon (30 days)">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-dark group hover:from-blue-500 hover:to-indigo-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Drivers</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-blue-300">{summary.totalDrivers}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">👥</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-red-500 hover:to-pink-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">🚨 Critical Risk</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-red-300">{summary.criticalRiskCount}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">⚠️</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-orange-500 hover:to-yellow-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">⚠️ High Risk</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-orange-300">{summary.highRiskCount}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">🔔</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="card-dark group hover:from-rose-500 hover:to-red-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">📋 Expired Licenses</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-rose-300">{summary.expiredLicenseCount}</h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">📄</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-rose-500 to-red-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-center py-8">🔄 Loading safety scores...</p>
      ) : scores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-800/50">
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Driver Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Safety Score</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">On-Time Rate</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Incidents</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">License Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition duration-200">
                  <td className="px-4 py-3 text-sm text-slate-300">{score.driver?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-400">{score.safetyScore.toFixed(2)}/100</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{score.onTimeCompletionRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{score.incidentsCount}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{score.licenseStatus}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(score.riskLevel)}`}>
                      {score.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">📭 No safety scores available</p>
      )}
    </section>
  );
}
