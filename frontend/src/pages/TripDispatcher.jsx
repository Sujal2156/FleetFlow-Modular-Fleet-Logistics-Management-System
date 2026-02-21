import { useMemo, useState } from 'react'
import { FaRoute, FaTruck, FaUserTie, FaPlus, FaCheckCircle, FaTimesCircle, FaPlay, FaClipboardCheck } from 'react-icons/fa'

const initialVehicles = [
  { id: 'FL-TRK-101', name: 'Volvo FH16', maxCapacity: 24000, status: 'Available' },
  { id: 'FL-TRK-118', name: 'Scania R500', maxCapacity: 22000, status: 'Available' },
  { id: 'FL-VAN-204', name: 'Mercedes Sprinter', maxCapacity: 3200, status: 'Available' },
  { id: 'FL-BIKE-017', name: 'Tata Ace', maxCapacity: 850, status: 'In Shop' }
]

const initialDrivers = [
  { id: 'DRV-101', name: 'A. Sharma', status: 'Available' },
  { id: 'DRV-104', name: 'M. Iqbal', status: 'Available' },
  { id: 'DRV-112', name: 'S. Patel', status: 'Available' },
  { id: 'DRV-118', name: 'N. Roy', status: 'Off Duty' }
]

const initialTrips = [
  { id: 'TRP-1201', origin: 'Delhi', destination: 'Jaipur', vehicleId: 'FL-TRK-101', driverId: 'DRV-101', cargoWeight: 12400, status: 'Dispatched' },
  { id: 'TRP-1202', origin: 'Mumbai', destination: 'Pune', vehicleId: 'FL-VAN-204', driverId: 'DRV-104', cargoWeight: 1100, status: 'Draft' },
  { id: 'TRP-1203', origin: 'Chennai', destination: 'Bengaluru', vehicleId: 'FL-TRK-118', driverId: 'DRV-112', cargoWeight: 16800, status: 'Completed' }
]

function TripDispatcher() {
  const [vehicles] = useState(initialVehicles)
  const [drivers] = useState(initialDrivers)
  const [trips, setTrips] = useState(initialTrips)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: ''
  })

  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'Available')
  const availableDrivers = drivers.filter(driver => driver.status === 'Available')

  const stats = useMemo(() => {
    return {
      availableVehicles: availableVehicles.length,
      availableDrivers: availableDrivers.length,
      activeTrips: trips.filter(trip => trip.status === 'Dispatched').length,
      draftTrips: trips.filter(trip => trip.status === 'Draft').length
    }
  }, [availableDrivers.length, availableVehicles.length, trips])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateTrip = () => {
    if (!formData.origin || !formData.destination || !formData.vehicleId || !formData.driverId || !formData.cargoWeight) {
      alert('Please fill all required fields to create a trip')
      return
    }

    const selectedVehicle = vehicles.find(vehicle => vehicle.id === formData.vehicleId)
    const cargoWeight = Number(formData.cargoWeight)

    if (selectedVehicle && cargoWeight > selectedVehicle.maxCapacity) {
      alert('Cargo weight exceeds the vehicle maximum capacity')
      return
    }

    const newTrip = {
      id: `TRP-${1200 + trips.length + 1}`,
      origin: formData.origin,
      destination: formData.destination,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      cargoWeight: cargoWeight,
      status: 'Draft'
    }

    setTrips([newTrip, ...trips])
    setFormData({ origin: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '' })
    alert('Trip created in Draft status')
  }

  const updateTripStatus = (tripId, nextStatus) => {
    const updated = trips.map(trip =>
      trip.id === tripId ? { ...trip, status: nextStatus } : trip
    )
    setTrips(updated)
  }

  const getStatusBadge = (status) => {
    if (status === 'Draft') return 'badge-warning'
    if (status === 'Dispatched') return 'badge-info'
    if (status === 'Completed') return 'badge-success'
    return 'badge-danger'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaRoute /> Trip Dispatcher & Management</h1>
        <p className="page-subtitle">Plan, assign, and track trips from creation to completion</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaTruck /></div>
          <div className="stat-label">Available Vehicles</div>
          <div className="stat-value">{stats.availableVehicles}</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaUserTie /></div>
          <div className="stat-label">Available Drivers</div>
          <div className="stat-value">{stats.availableDrivers}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaClipboardCheck /></div>
          <div className="stat-label">Draft Trips</div>
          <div className="stat-value">{stats.draftTrips}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaPlay /></div>
          <div className="stat-label">Dispatched Trips</div>
          <div className="stat-value">{stats.activeTrips}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaPlus /> Create Trip</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Origin</label>
            <input
              className="form-input"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="City A"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Destination</label>
            <input
              className="form-input"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="City B"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle</label>
            <select className="form-select" name="vehicleId" value={formData.vehicleId} onChange={handleInputChange}>
              <option value="">Select Available Vehicle</option>
              {availableVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.id} - {vehicle.name} ({vehicle.maxCapacity} kg)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Driver</label>
            <select className="form-select" name="driverId" value={formData.driverId} onChange={handleInputChange}>
              <option value="">Select Available Driver</option>
              {availableDrivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.id} - {driver.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Cargo Weight (kg)</label>
          <input
            className="form-input"
            name="cargoWeight"
            type="number"
            value={formData.cargoWeight}
            onChange={handleInputChange}
            placeholder="12000"
          />
          <div className="muted">Validation: Cargo weight must be within vehicle max capacity.</div>
        </div>
        <button className="btn btn-primary" onClick={handleCreateTrip}>
          <FaPlus /> Create Draft Trip
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaRoute /> Trip Lifecycle</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo (kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td><strong>{trip.id}</strong></td>
                  <td>{trip.origin} to {trip.destination}</td>
                  <td>{trip.vehicleId}</td>
                  <td>{trip.driverId}</td>
                  <td>{trip.cargoWeight}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(trip.status)}`}>{trip.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {trip.status === 'Draft' && (
                        <button className="btn btn-sm btn-info" onClick={() => updateTripStatus(trip.id, 'Dispatched')}>
                          <FaPlay />
                        </button>
                      )}
                      {trip.status === 'Dispatched' && (
                        <button className="btn btn-sm btn-success" onClick={() => updateTripStatus(trip.id, 'Completed')}>
                          <FaCheckCircle />
                        </button>
                      )}
                      {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                        <button className="btn btn-sm btn-danger" onClick={() => updateTripStatus(trip.id, 'Cancelled')}>
                          <FaTimesCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title"><FaTruck /> Available Vehicles</h3>
          <div className="stack-list">
            {availableVehicles.map(vehicle => (
              <div key={vehicle.id} className="stack-item">
                <div>
                  <strong>{vehicle.id}</strong> - {vehicle.name}
                  <div className="muted">Max Capacity: {vehicle.maxCapacity} kg</div>
                </div>
                <span className="badge badge-success">{vehicle.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title"><FaUserTie /> Available Drivers</h3>
          <div className="stack-list">
            {availableDrivers.map(driver => (
              <div key={driver.id} className="stack-item">
                <div>
                  <strong>{driver.id}</strong> - {driver.name}
                  <div className="muted">Ready for dispatch</div>
                </div>
                <span className="badge badge-success">{driver.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDispatcher
