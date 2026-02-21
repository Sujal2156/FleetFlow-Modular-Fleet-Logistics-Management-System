import { useState } from 'react'
import { FaChartLine, FaDollarSign, FaFileExport, FaFilePdf, FaGasPump, FaTruck, FaMoneyBillWave, FaChartBar, FaChartPie } from 'react-icons/fa'
import { analyticsData }  from '../data/mockData'

function OperationalAnalytics() {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const {overview, monthlyRevenue, expenseBreakdown, vehicleUtilization, topRoutes} = analyticsData

  // Calculate Vehicle ROI
  const calculateVehicleROI = (revenue, maintenance, fuel, acquisitionCost) => {
    const roi = ((revenue - (maintenance + fuel)) / acquisitionCost) * 100;
    return roi.toFixed(2);
  };

  // Export to CSV function
  const exportToCSV = (reportType) => {
    let csvContent = '';
    const date = new Date().toLocaleDateString();
    
    if (reportType === 'Monthly') {
      csvContent = 'Month,Revenue,Expenses,Profit\n';
      monthlyRevenue.forEach(item => {
        csvContent += `${item.month},${item.revenue},${item.expenses},${item.revenue - item.expenses}\n`;
      });
    } else if (reportType === 'Routes') {
      csvContent = 'Route,Trips,Revenue,Avg Revenue per Trip\n';
      topRoutes.forEach(route => {
        csvContent += `${route.route},${route.trips},${route.revenue},${(route.revenue/route.trips).toFixed(2)}\n`;
      });
    } else {
      csvContent = 'Metric,Value\n';
      csvContent += `Total Revenue,${overview.totalRevenue}\n`;
      csvContent += `Total Expenses,${overview.totalExpenses}\n`;
      csvContent += `Net Profit,${overview.netProfit}\n`;
      csvContent += `Profit Margin,${overview.profitMargin}%\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `FleetFlow_${reportType}_Report_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`${reportType} report exported successfully`);
  };

  // Generate PDF (simulated with print)
  const generatePDF = () => {
    window.print();
    console.log('PDF generation triggered');
  };

  // Simple bar chart component
  const BarChart = ({ data, dataKey, valueKey, color = 'var(--primary)' }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]))
    
    return (
      <div style={{ padding: '1rem 0' }}>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '500' }}>{item[dataKey]}</span>
              <span style={{ fontWeight: '600', color: color }}>{item[valueKey].toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(item[valueKey] / maxValue) * 100}%`,
                  background: color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Line chart component (simulated)
  const LineChart = ({ data }) => {
    const maxRevenue = Math.max(...data.map(item => item.revenue))
    const maxExpense = Math.max(...data.map(item => item.expenses))
    const max = Math.max(maxRevenue, maxExpense)

    return (
      <div style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '3px', background: 'var(--secondary)' }}></div>
            <span>Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '3px', background: 'var(--danger)' }}></div>
            <span>Expenses</span>
          </div>
        </div>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              {item.month}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div className="progress-bar">
                  <div 
                    className="progress-fill success"
                    style={{ width: `${(item.revenue / max) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', minWidth: '80px', textAlign: 'right', color: 'var(--secondary)' }}>
                ${(item.revenue / 1000).toFixed(0)}k
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <div style={{ flex: 1 }}>
                <div className="progress-bar">
                  <div 
                    className="progress-fill danger"
                    style={{ width: `${(item.expenses / max) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', minWidth: '80px', textAlign: 'right', color: 'var(--danger)' }}>
                ${(item.expenses / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Pie chart component (simulated with bars)
  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0)
    
    return (
      <div style={{ padding: '1rem 0' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', borderRadius: '999px', overflow: 'hidden', height: '20px' }}>
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  width: `${item.percentage}%`,
                  background: 
                    item.category === 'Fuel' ? 'var(--warning)' :
                    item.category === 'Maintenance' ? 'var(--danger)' :
                    item.category === 'Salaries' ? 'var(--primary)' :
                    item.category === 'Insurance' ? 'var(--info)' : 'var(--text-light)'
                }}
              ></div>
            ))}
          </div>
        </div>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 
                  item.category === 'Fuel' ? 'var(--warning)' :
                  item.category === 'Maintenance' ? 'var(--danger)' :
                  item.category === 'Salaries' ? 'var(--primary)' :
                  item.category === 'Insurance' ? 'var(--info)' : 'var(--text-light)'
              }}></div>
              <span style={{ fontSize: '0.875rem' }}>{item.category}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600' }}>${item.amount.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    )
  }



  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaChartLine /> Operational Analytics & Financial Reports</h1>
        <p className="page-subtitle">Comprehensive insights into fleet operations and financial performance</p>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${(overview.totalRevenue / 1000).toFixed(1)}k</div>
          <div className="stat-change">+12.5% from last month</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${(overview.totalExpenses / 1000).toFixed(1)}k</div>
          <div className="stat-change">+8.3% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-label">Net Profit</div>
          <div className="stat-value">${(overview.netProfit / 1000).toFixed(1)}k</div>
          <div className="stat-change">Margin: {overview.profitMargin}%</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaGasPump /></div>
          <div className="stat-label">Fuel Efficiency</div>
          <div className="stat-value">{overview.avgFuelEfficiency} km/L</div>
          <div className="stat-change">Fleet Average</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-label">Avg Vehicle ROI</div>
          <div className="stat-value">{calculateVehicleROI(245600, 42800, 95600, 450000)}%</div>
          <div className="stat-change">Return on Investment</div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="card">
        <div className="flex-between">
          <div className="filter-group">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
              <option value="revenue">Revenue Analysis</option>
              <option value="expenses">Expense Analysis</option>
              <option value="profit">Profit Analysis</option>
              <option value="efficiency">Efficiency Metrics</option>
            </select>
          </div>
          <div className="filter-group">
            <button className="btn btn-success" onClick={generatePDF}>
              <FaFilePdf /> Generate PDF
            </button>
            <button className="btn btn-info" onClick={() => exportToCSV('Monthly')}>
              <FaFileExport /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue vs Expenses Chart */}
        <div className="chart-card">
          <h3 className="chart-title"><FaChartLine /> Revenue vs Expenses Trend</h3>
          <LineChart data={monthlyRevenue} />
        </div>

        {/* Expense Breakdown Chart */}
        <div className="chart-card">
          <h3 className="chart-title"><FaChartPie /> Expense Breakdown</h3>
          <PieChart data={expenseBreakdown} />
        </div>
      </div>

      {/* Vehicle Utilization */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🚛 Vehicle Utilization</h3>
        </div>
        <BarChart 
          data={vehicleUtilization} 
          dataKey="vehicle" 
          valueKey="utilization" 
          color="var(--primary)"
        />
      </div>

      {/* Top Routes */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🗺️ Top Performing Routes</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Route</th>
                <th>Total Trips</th>
                <th>Revenue</th>
                <th>Avg Revenue/Trip</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((route, index) => (
                <tr key={index}>
                  <td>
                    <span style={{ 
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-light)'
                    }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                  </td>
                  <td><strong>{route.route}</strong></td>
                  <td>{route.trips}</td>
                  <td><strong>${route.revenue.toLocaleString()}</strong></td>
                  <td>${(route.revenue / route.trips).toFixed(0)}</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill success"
                        style={{ width: `${(route.revenue / topRoutes[0].revenue) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>⛽ Fuel Analytics</h4>
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Total Consumption</span>
              <strong>{overview.fuelConsumption.toLocaleString()} L</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Avg Efficiency</span>
              <strong>{overview.avgFuelEfficiency} km/L</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Fuel Cost</span>
              <strong>${expenseBreakdown[0].amount.toLocaleString()}</strong>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill warning" style={{ width: '78%' }}></div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
            78% of budget utilized
          </p>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>🔧 Maintenance Overview</h4>
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Total Cost</span>
              <strong>${expenseBreakdown[1].amount.toLocaleString()}</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Preventive</span>
              <span className="badge badge-success">65%</span>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Repairs</span>
              <span className="badge badge-warning">35%</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill danger" style={{ width: '62%' }}></div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
            62% of budget utilized
          </p>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>📊 Efficiency Metrics</h4>
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Fleet Utilization</span>
              <strong>78%</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>On-Time Delivery</span>
              <strong>96.7%</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-light)' }}>Cost per km</span>
              <strong>$3.91</strong>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="badge badge-success">Excellent</span>
            <span className="badge badge-info">Above Target</span>
          </div>
        </div>
      </div>

      {/* ROI Calculation Details */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaTruck /> Vehicle ROI Calculation</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', margin: 0 }}>
            Formula: (Revenue - (Maintenance + Fuel)) / Acquisition Cost × 100
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Revenue</th>
                <th>Fuel Cost</th>
                <th>Maintenance</th>
                <th>Acquisition Cost</th>
                <th>ROI %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>FL-2024-001</strong></td>
                <td>${(52000).toLocaleString()}</td>
                <td>${(20500).toLocaleString()}</td>
                <td>${(8900).toLocaleString()}</td>
                <td>${(95000).toLocaleString()}</td>
                <td><strong>{calculateVehicleROI(52000, 8900, 20500, 95000)}%</strong></td>
                <td><span className="badge badge-success">Profitable</span></td>
              </tr>
              <tr>
                <td><strong>FL-2024-002</strong></td>
                <td>${(48000).toLocaleString()}</td>
                <td>${(19200).toLocaleString()}</td>
                <td>${(10200).toLocaleString()}</td>
                <td>${(88000).toLocaleString()}</td>
                <td><strong>{calculateVehicleROI(48000, 10200, 19200, 88000)}%</strong></td>
                <td><span className="badge badge-success">Profitable</span></td>
              </tr>
              <tr>
                <td><strong>FL-2024-003</strong></td>
                <td>${(44000).toLocaleString()}</td>
                <td>${(18500).toLocaleString()}</td>
                <td>${(9500).toLocaleString()}</td>
                <td>${(92000).toLocaleString()}</td>
                <td><strong>{calculateVehicleROI(44000, 9500, 18500, 92000)}%</strong></td>
                <td><span className="badge badge-success">Profitable</span></td>
              </tr>
              <tr>
                <td><strong>FL-2024-004</strong></td>
                <td>${(38000).toLocaleString()}</td>
                <td>${(17400).toLocaleString()}</td>
                <td>${(12200).toLocaleString()}</td>
                <td>${(85000).toLocaleString()}</td>
                <td><strong>{calculateVehicleROI(38000, 12200, 17400, 85000)}%</strong></td>
                <td><span className="badge badge-warning">Moderate</span></td>
              </tr>
              <tr>
                <td><strong>FL-2024-005</strong></td>
                <td>${(22000).toLocaleString()}</td>
                <td>${(12000).toLocaleString()}</td>
                <td>${(8000).toLocaleString()}</td>
                <td>${(90000).toLocaleString()}</td>
                <td><strong>{calculateVehicleROI(22000, 8000, 12000, 90000)}%</strong></td>
                <td><span className="badge badge-danger">Low Utilization</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h4 style={{ marginBottom: '1rem' }}><FaFileExport /> One-Click Export Options</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Download CSV files for monthly payroll and health audits
        </p>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => exportToCSV('Monthly')}>
            <FaFileExport /> Monthly Financial CSV
          </button>
          <button className="btn btn-success" onClick={() => exportToCSV('Routes')}>
            <FaChartBar /> Route Performance CSV
          </button>
          <button className="btn btn-info" onClick={() => exportToCSV('Summary')}>
            <FaChartLine /> Executive Summary CSV
          </button>
          <button className="btn btn-warning" onClick={generatePDF}>
            <FaFilePdf /> Print/Save as PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default OperationalAnalytics
