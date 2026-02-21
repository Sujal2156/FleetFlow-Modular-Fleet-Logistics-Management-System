import { useState } from 'react'
import { FaTools, FaPlus, FaSearch, FaEdit, FaTrash, FaWrench, FaCar, FaCheckCircle, FaClock, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa'
import { maintenanceData } from '../data/mockData'

function MaintenanceLogs() {
  const [maintenance, setMaintenance] = useState(maintenanceData)
  const [filteredRecords, setFilteredRecords] = useState(maintenanceData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicleName: '',
    type: 'Preventive',
    service: '',
    date: '',
    nextDue: '',
    mileage: '',
    cost: '',
    serviceProvider: '',
    technician: '',
    status: 'Scheduled',
    priority: 'Medium',
    notes: ''
  })

  // Search and filter
  const handleSearch = (term) => {
    setSearchTerm(term)
    filterRecords(term, filterType, filterStatus)
  }

  const handleTypeFilter = (type) => {
    setFilterType(type)
    filterRecords(searchTerm, type, filterStatus)
  }

  const handleStatusFilter = (status) => {
    setFilterStatus(status)
    filterRecords(searchTerm, filterType, status)
  }

  const filterRecords = (search, type, status) => {
    let filtered = [...maintenance]

    if (search) {
      filtered = filtered.filter(record =>
        record.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
        record.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
        record.service.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (type !== 'all') {
      filtered = filtered.filter(record => record.type === type)
    }

    if (status !== 'all') {
      filtered = filtered.filter(record => record.status === status)
    }

    setFilteredRecords(filtered)
  }

  // Modal functions
  const openAddModal = () => {
    setEditingRecord(null)
    setFormData({
      vehicleId: '',
      vehicleName: '',
      type: 'Preventive',
      service: '',
      date: '',
      nextDue: '',
      mileage: '',
      cost: '',
      serviceProvider: '',
      technician: '',
      status: 'Scheduled',
      priority: 'Medium',
      notes: ''
    })
    setShowModal(true)
  }

  const openEditModal = (record) => {
    setEditingRecord(record)
    setFormData(record)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRecord(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.vehicleId || !formData.service || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingRecord) {
      // Update existing record
      const updated = maintenance.map(r => r.id === editingRecord.id ? { ...formData, id: r.id } : r)
      setMaintenance(updated)
      setFilteredRecords(updated)
      alert('Maintenance record updated successfully!');
    } else {
      // Add new record - automatically sets vehicle to "In Shop" status
      const newRecord = { ...formData, id: maintenance.length + 1 }
      const updated = [newRecord, ...maintenance]
      setMaintenance(updated)
      setFilteredRecords(updated)
      
      // Logic: Vehicle status automatically changed to "In Shop" when service is added
      console.log(`Vehicle ${formData.vehicleId} status changed to "In Shop" - removed from dispatcher pool`);
      alert(`Service record added! Vehicle ${formData.vehicleId} is now marked as "In Shop" and unavailable for dispatch.`);
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this record?')) {
      const updated = maintenance.filter(r => r.id !== id)
      setMaintenance(updated)
      setFilteredRecords(updated)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Completed': 'badge-success',
      'In Progress': 'badge-warning',
      'Scheduled': 'badge-info',
    }
    return badges[status] || 'badge-primary'
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      'Critical': 'badge-danger',
      'High': 'badge-warning',
      'Medium': 'badge-info',
      'Low': 'badge-success'
    }
    return badges[priority] || 'badge-primary'
  }

  const stats = {
    total: maintenance.length,
    completed: maintenance.filter(m => m.status === 'Completed').length,
    inProgress: maintenance.filter(m => m.status === 'In Progress').length,
    scheduled: maintenance.filter(m => m.status === 'Scheduled').length,
    totalCost: maintenance.reduce((sum, m) => sum + m.cost, 0)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaTools /> Maintenance & Service Logs</h1>
        <p className="page-subtitle">Manage and track all vehicle maintenance activities</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaCar /></div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats.completed}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaHourglassHalf /></div>
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{stats.inProgress}</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">{stats.scheduled}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><FaWrench /></div>
          <div className="stat-label">Total Cost</div>
          <div className="stat-value">${stats.totalCost.toLocaleString()}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="search-filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by vehicle, service..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterType} onChange={(e) => handleTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
            </select>
            <select value={filterStatus} onChange={(e) => handleStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="btn btn-primary" onClick={openAddModal}>
              ➕ Add New Record
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaCar /> Maintenance Records</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', margin: 0 }}>
            <FaExclamationTriangle /> Note: Adding a service automatically marks vehicle as "In Shop" (unavailable for dispatch)
          </p>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Vehicle Name</th>
                <th>Type</th>
                <th>Service</th>
                <th>Date</th>
                <th>Next Due</th>
                <th>Mileage</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <div className="empty-state-text">No maintenance records found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.vehicleId}</strong></td>
                    <td>{record.vehicleName}</td>
                    <td><span className="badge badge-primary">{record.type}</span></td>
                    <td>{record.service}</td>
                    <td>{record.date}</td>
                    <td>{record.nextDue || 'N/A'}</td>
                    <td>{record.mileage.toLocaleString()} km</td>
                    <td><strong>${record.cost}</strong></td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadge(record.priority)}`}>
                        {record.priority}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => openEditModal(record)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(record.id)}
                        >
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingRecord ? <><FaEdit /> Edit Maintenance Record</> : <><FaPlus /> Add New Maintenance Record</>}
              </h2>
              <button className="btn btn-sm btn-danger" onClick={closeModal}>✖</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Vehicle ID</label>
                <input
                  type="text"
                  className="form-input"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  placeholder="FL-2024-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Name</label>
                <input
                  type="text"
                  className="form-input"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  placeholder="Volvo FH16"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="Preventive">Preventive</option>
                  <option value="Repair">Repair</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Service Description</label>
                <input
                  type="text"
                  className="form-input"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  placeholder="Oil Change & Filter Replacement"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Date</label>
                <input
                  type="date"
                  className="form-input"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Next Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  name="nextDue"
                  value={formData.nextDue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mileage (km)</label>
                <input
                  type="number"
                  className="form-input"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="45000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost ($)</label>
                <input
                  type="number"
                  className="form-input"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="450"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Provider</label>
                <input
                  type="text"
                  className="form-input"
                  name="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={handleInputChange}
                  placeholder="Volvo Service Center"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Technician</label>
                <input
                  type="text"
                  className="form-input"
                  name="technician"
                  value={formData.technician}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" name="priority" value={formData.priority} onChange={handleInputChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingRecord ? 'Update Record' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenanceLogs
