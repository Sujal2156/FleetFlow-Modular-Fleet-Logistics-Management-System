import { useState } from 'react'
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaBan, FaCheckCircle, FaTruck, FaSearch } from 'react-icons/fa'

const initialVehicles = [
  { id: 1, name: 'Volvo FH16', plate: 'FL-TRK-101', capacity: 24000, odometer: 182430, outOfService: false },
  { id: 2, name: 'Mercedes Sprinter', plate: 'FL-VAN-204', capacity: 3200, odometer: 95420, outOfService: false },
  { id: 3, name: 'Tata Ace', plate: 'FL-BIKE-017', capacity: 850, odometer: 45110, outOfService: false },
  { id: 4, name: 'Scania R500', plate: 'FL-TRK-118', capacity: 22000, odometer: 209990, outOfService: true }
]

function VehicleRegistry() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    capacity: '',
    odometer: '',
    outOfService: false
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !vehicle.outOfService) ||
      (filterStatus === 'retired' && vehicle.outOfService)
    return matchSearch && matchStatus
  })

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(vehicle => !vehicle.outOfService).length,
    retired: vehicles.filter(vehicle => vehicle.outOfService).length,
    avgCapacity: vehicles.length
      ? Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.capacity, 0) / vehicles.length)
      : 0
  }

  const openAddModal = () => {
    setEditingVehicle(null)
    setFormData({ name: '', plate: '', capacity: '', odometer: '', outOfService: false })
    setShowModal(true)
  }

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData(vehicle)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingVehicle(null)
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.plate || !formData.capacity) {
      alert('Please fill required fields: Name, License Plate, Capacity')
      return
    }

    const plateExists = vehicles.some(vehicle =>
      vehicle.plate.toLowerCase() === formData.plate.toLowerCase() &&
      (!editingVehicle || vehicle.id !== editingVehicle.id)
    )

    if (plateExists) {
      alert('License Plate must be unique')
      return
    }

    if (editingVehicle) {
      const updated = vehicles.map(vehicle =>
        vehicle.id === editingVehicle.id
          ? { ...formData, id: vehicle.id, capacity: Number(formData.capacity), odometer: Number(formData.odometer || 0) }
          : vehicle
      )
      setVehicles(updated)
      alert('Vehicle updated successfully')
    } else {
      const newVehicle = {
        ...formData,
        id: vehicles.length + 1,
        capacity: Number(formData.capacity),
        odometer: Number(formData.odometer || 0)
      }
      setVehicles([newVehicle, ...vehicles])
      alert('Vehicle added successfully')
    }

    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
    }
  }

  const toggleOutOfService = (id) => {
    const updated = vehicles.map(vehicle =>
      vehicle.id === id ? { ...vehicle, outOfService: !vehicle.outOfService } : vehicle
    )
    setVehicles(updated)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaClipboardList /> Vehicle Registry</h1>
        <p className="page-subtitle">Track assets, capacity, and service status</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaTruck /></div>
          <div className="stat-label">Total Assets</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-label">Active Assets</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><FaBan /></div>
          <div className="stat-label">Out of Service</div>
          <div className="stat-value">{stats.retired}</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaClipboardList /></div>
          <div className="stat-label">Avg Capacity</div>
          <div className="stat-value">{stats.avgCapacity} kg</div>
        </div>
      </div>

      <div className="card">
        <div className="search-filter-bar">
          <div className="search-box">
            <span className="search-icon"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by name or license plate"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="retired">Out of Service</option>
            </select>
            <button className="btn btn-primary" onClick={openAddModal}>
              <FaPlus /> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaTruck /> Fleet Assets</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>License Plate</th>
                <th>Max Load (kg)</th>
                <th>Odometer</th>
                <th>Status</th>
                <th>Out of Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No vehicles found</td>
                </tr>
              ) : (
                filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td><strong>{vehicle.name}</strong></td>
                    <td>{vehicle.plate}</td>
                    <td>{vehicle.capacity.toLocaleString()}</td>
                    <td>{vehicle.odometer.toLocaleString()} km</td>
                    <td>
                      <span className={`badge ${vehicle.outOfService ? 'badge-danger' : 'badge-success'}`}>
                        {vehicle.outOfService ? 'Out of Service' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <label className="toggle-wrap">
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={vehicle.outOfService}
                          onChange={() => toggleOutOfService(vehicle.id)}
                        />
                        <span className="toggle-label">{vehicle.outOfService ? 'Retired' : 'Active'}</span>
                      </label>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-sm btn-info" onClick={() => openEditModal(vehicle)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vehicle.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingVehicle ? <><FaEdit /> Edit Vehicle</> : <><FaPlus /> Add Vehicle</>}
              </h2>
              <button className="btn btn-sm btn-danger" onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name / Model</label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Volvo FH16"
                />
              </div>
              <div className="form-group">
                <label className="form-label">License Plate (Unique)</label>
                <input
                  className="form-input"
                  name="plate"
                  value={formData.plate}
                  onChange={handleInputChange}
                  placeholder="FL-TRK-001"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Max Load Capacity (kg)</label>
                  <input
                    className="form-input"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="24000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Odometer (km)</label>
                  <input
                    className="form-input"
                    name="odometer"
                    type="number"
                    value={formData.odometer}
                    onChange={handleInputChange}
                    placeholder="185000"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="toggle-wrap">
                  <input
                    type="checkbox"
                    name="outOfService"
                    className="toggle"
                    checked={formData.outOfService}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-label">Mark as Out of Service (Retired)</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleRegistry
