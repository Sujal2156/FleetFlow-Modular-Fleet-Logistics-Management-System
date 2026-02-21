import { useEffect, useMemo, useState } from "react";
import { exportAnalyticsReport, getAnalyticsSummary } from "../api";

export default function AnalyticsPanel() {
  const [summary, setSummary] = useState({
    fuelEfficiencyKmPerLiter: 0,
    fleetRoiPercent: 0,
    deadStockAlerts: 0,
    totalOperationalCost: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState("");

  const cards = useMemo(
    () => [
      { label: "Fuel Efficiency (km/L)", value: summary.fuelEfficiencyKmPerLiter },
      { label: "Fleet ROI (%)", value: summary.fleetRoiPercent },
      { label: "Dead Stock Alerts", value: summary.deadStockAlerts },
      { label: "Total Operational Cost", value: summary.totalOperationalCost },
    ],
    [summary]
  );

  async function loadSummary() {
    setLoading(true);
    setError("");
    try {
      const response = await getAnalyticsSummary();
      setSummary(response.summary || summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleExport(format) {
    setExporting(format);
    setError("");
    try {
      const blob = await exportAnalyticsReport(format);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `fleetflow-analytics-${Date.now()}.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting("");
    }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Operational Analytics</h2>
          <p className="text-slate-400">Performance metrics and insights</p>
        </div>
        <button
          onClick={loadSummary}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "🔄 Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => handleExport("csv")}
          disabled={exporting !== ""}
          className="btn-primary disabled:opacity-50"
        >
          {exporting === "csv" ? "📥 Exporting CSV..." : "📥 Export CSV"}
        </button>
        <button
          onClick={() => handleExport("pdf")}
          disabled={exporting !== ""}
          className="btn-danger disabled:opacity-50"
        >
          {exporting === "pdf" ? "📥 Exporting PDF..." : "📥 Export PDF"}
        </button>
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
            className="card-dark group hover:from-emerald-500 hover:to-teal-600 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{card.label}</p>
                <h3 className="text-4xl font-bold text-white mt-3 group-hover:text-emerald-300">
                  {typeof card.value === "number" && card.label.includes("%")
                    ? `${card.value}%`
                    : card.value}
                </h3>
              </div>
              <div className="text-4xl opacity-20 group-hover:opacity-40">📈</div>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
