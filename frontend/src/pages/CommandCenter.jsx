import { useMemo, useState } from 'react'
import { FaTachometerAlt, FaTruck, FaTools, FaChartLine, FaBoxOpen, FaFilter, FaMapMarkerAlt } from 'react-icons/fa'

const fleetData = [
  { id: 'FL-TRK-101', type: 'Truck', status: 'On Trip', region: 'North', driver: 'A. Sharma', eta: '2h 10m' },
  { id: 'FL-TRK-102', type: 'Truck', status: 'Idle', region: 'North', driver: 'K. Rao', eta: 'Standby' },
  { id: 'FL-VAN-204', type: 'Van', status: 'On Trip', region: 'West', driver: 'M. Iqbal', eta: '1h 40m' },
  { id: 'FL-BIKE-017', type: 'Bike', status: 'On Trip', region: 'South', driver: 'S. Patel', eta: '0h 35m' },
  { id: 'FL-VAN-211', type: 'Van', status: 'In Shop', region: 'East', driver: 'N/A', eta: 'Maintenance' },
  { id: 'FL-TRK-118', type: 'Truck', status: 'Idle', region: 'East', driver: 'P. Singh', eta: 'Standby' },
  { id: 'FL-TRK-121', type: 'Truck', status: 'On Trip', region: 'South', driver: 'R. Das', eta: '3h 05m' },
  { id: 'FL-BIKE-025', type: 'Bike', status: 'Idle', region: 'West', driver: 'N. Roy', eta: 'Standby' }
]

const cargoQueue = [
  { id: 'CG-201', origin: 'Delhi', destination: 'Jaipur', weight: 1800, priority: 'High', status: 'Pending' },
  { id: 'CG-202', origin: 'Mumbai', destination: 'Pune', weight: 650, priority: 'Medium', status: 'Pending' },
  { id: 'CG-203', origin: 'Chennai', destination: 'Bengaluru', weight: 920, priority: 'High', status: 'Pending' },
  { id: 'CG-204', origin: 'Kolkata', destination: 'Durgapur', weight: 420, priority: 'Low', status: 'Pending' }
]

function CommandCenter() {
  const [vehicleType, setVehicleType] = useState('All')
  const [status, setStatus] = useState('All')
  const [region, setRegion] = useState('All')

  const filteredFleet = useMemo(() => {
    return fleetData.filter(vehicle => {
      const matchType = vehicleType === 'All' || vehicle.type === vehicleType
      const matchStatus = status === 'All' || vehicle.status === status
      const matchRegion = region === 'All' || vehicle.region === region
      return matchType && matchStatus && matchRegion
    })
  }, [vehicleType, status, region])

  const kpis = useMemo(() => {
    const activeFleet = filteredFleet.filter(v => v.status === 'On Trip').length
    const maintenanceAlerts = filteredFleet.filter(v => v.status === 'In Shop').length
    const utilizationRate = filteredFleet.length
      ? Math.round((filteredFleet.filter(v => v.status !== 'Idle').length / filteredFleet.length) * 100)
      : 0

    return {
      activeFleet,
      maintenanceAlerts,
      utilizationRate,
      pendingCargo: cargoQueue.length
    }
  }, [filteredFleet])

  const regionStats = useMemo(() => {
    const regions = [...new Set(filteredFleet.map(vehicle => vehicle.region))]
    return regions.map(regionName => {
      const vehicles = filteredFleet.filter(vehicle => vehicle.region === regionName)
      const active = vehicles.filter(vehicle => vehicle.status === 'On Trip').length
      const utilization = vehicles.length ? Math.round((active / vehicles.length) * 100) : 0
      return {
        region: regionName,
        total: vehicles.length,
        active,
        utilization
      }
    })
  }, [filteredFleet])

  const getPriorityBadge = (priority) => {
    if (priority === 'High') return 'badge-danger'
    if (priority === 'Medium') return 'badge-warning'
    return 'badge-info'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaTachometerAlt /> Command Center</h1>
        <p className="page-subtitle">Real-time fleet visibility and dispatch intelligence</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaTruck /></div>
          <div className="stat-label">Active Fleet</div>
          <div className="stat-value">{kpis.activeFleet}</div>
          <div className="stat-change">Vehicles currently on trip</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaTools /></div>
          <div className="stat-label">Maintenance Alerts</div>
          <div className="stat-value">{kpis.maintenanceAlerts}</div>
          <div className="stat-change">Vehicles marked in shop</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-label">Utilization Rate</div>
          <div className="stat-value">{kpis.utilizationRate}%</div>
          <div className="stat-change">Assigned vs idle fleet</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaBoxOpen /></div>
          <div className="stat-label">Pending Cargo</div>
          <div className="stat-value">{kpis.pendingCargo}</div>
          <div className="stat-change">Awaiting assignment</div>
        </div>
      </div>

      <div className="card">
        <div className="search-filter-bar">
          <div className="filter-group">
            <span className="filter-label"><FaFilter /> Filters</span>
            <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
              <option value="All">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Bike">Bike</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="All">All Status</option>
              <option value="On Trip">On Trip</option>
              <option value="Idle">Idle</option>
              <option value="In Shop">In Shop</option>
            </select>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title"><FaTruck /> Fleet Status Board</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Region</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {filteredFleet.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td><strong>{vehicle.id}</strong></td>
                    <td>{vehicle.type}</td>
                    <td>
                      <span className={`badge ${vehicle.status === 'On Trip' ? 'badge-success' : vehicle.status === 'In Shop' ? 'badge-warning' : 'badge-info'}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td>{vehicle.driver}</td>
                    <td>{vehicle.region}</td>
                    <td>{vehicle.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title"><FaBoxOpen /> Pending Cargo Queue</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cargo ID</th>
                  <th>Route</th>
                  <th>Weight (kg)</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cargoQueue.map(cargo => (
                  <tr key={cargo.id}>
                    <td><strong>{cargo.id}</strong></td>
                    <td>{cargo.origin} to {cargo.destination}</td>
                    <td>{cargo.weight}</td>
                    <td><span className={`badge ${getPriorityBadge(cargo.priority)}`}>{cargo.priority}</span></td>
                    <td><span className="badge badge-info">{cargo.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaMapMarkerAlt /> Regional Utilization</h3>
        </div>
        <div className="grid-3">
          {regionStats.map(regionItem => (
            <div key={regionItem.region} className="summary-card">
              <div className="summary-title">{regionItem.region}</div>
              <div className="summary-value">{regionItem.utilization}%</div>
              <div className="summary-meta">{regionItem.active} active / {regionItem.total} total</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${regionItem.utilization}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommandCenter
