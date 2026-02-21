import { useState } from 'react'
import { driversData } from '../data/mockData'

function DriverPerformance() {
  const [drivers, setDrivers] = useState(driversData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('safetyScore')
  const [showModal, setShowModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Check if license is expired
  const isLicenseExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Toggle driver status
  const toggleDriverStatus = (driverId, newStatus) => {
    const updated = drivers.map(d => 
      d.id === driverId ? { ...d, status: newStatus } : d
    );
    setDrivers(updated);
    
    console.log(`Driver status changed to: ${newStatus}`);
    alert(`Driver status updated to: ${newStatus}`);
  };

  // Filter and search drivers
  const filteredDrivers = drivers
    .filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || driver.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => b[sortBy] - a[sortBy])

  const openDetails = (driver) => {
    setSelectedDriver(driver)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDriver(null)
  }

  const getScoreColor = (score) => {
    if (score >= 95) return 'success'
    if (score >= 85) return 'info'
    if (score >= 75) return 'warning'
    return 'danger'
  }

  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'Active').length,
    avgSafetyScore: (drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length).toFixed(1),
    avgPerformanceScore: (drivers.reduce((sum, d) => sum + d.performanceScore, 0) / drivers.length).toFixed(1),
    totalTrips: drivers.reduce((sum, d) => sum + d.totalTrips, 0),
    avgOnTime: (drivers.reduce((sum, d) => sum + d.onTimeDelivery, 0) / drivers.length).toFixed(1)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👨‍✈️ Driver Performance & Safety Profiles</h1>
        <p className="page-subtitle">Monitor driver performance, safety scores, and compliance metrics</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Drivers</div>
          <div className="stat-value">{stats.totalDrivers}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Active Drivers</div>
          <div className="stat-value">{stats.activeDrivers}</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">🛡️</div>
          <div className="stat-label">Avg Safety Score</div>
          <div className="stat-value">{stats.avgSafetyScore}%</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">Avg Performance</div>
          <div className="stat-value">{stats.avgPerformanceScore}%</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">🚛</div>
          <div className="stat-label">Total Trips</div>
          <div className="stat-value">{stats.totalTrips}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="search-filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or driver ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="safetyScore">Sort by Safety Score</option>
              <option value="performanceScore">Sort by Performance</option>
              <option value="totalTrips">Sort by Total Trips</option>
              <option value="avgRating">Sort by Rating</option>
              <option value="onTimeDelivery">Sort by On-Time %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="driver-grid">
        {filteredDrivers.map((driver) => {
          const licenseExpired = isLicenseExpired(driver.licenseExpiry);
          
          return (
            <div key={driver.id} className="driver-card" style={{
              border: licenseExpired ? '3px solid var(--danger)' : '1px solid var(--border)'
            }}>
              {licenseExpired && (
                <div style={{ 
                  background: 'var(--danger)', 
                  color: 'white', 
                  padding: '0.5rem', 
                  marginBottom: '1rem',
                  borderRadius: 'var(--radius)',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  ⚠️ LICENSE EXPIRED - CANNOT BE ASSIGNED
                </div>
              )}
              <div className="driver-header">
                <div className="driver-photo">{driver.photo}</div>
                <div className="driver-info">
                  <h3>{driver.name}</h3>
                  <p className="driver-meta">🆔 {driver.driverId}</p>
                  <p className="driver-meta">📞 {driver.phone}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <select 
                      value={driver.status}
                      onChange={(e) => toggleDriverStatus(driver.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      <option value="On Duty">On Duty</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="driver-scores">
                <div className="score-item">
                  <div className={`score-value ${getScoreColor(driver.safetyScore)}`}>
                    {driver.safetyScore}%
                  </div>
                  <div className="score-label">Safety Score</div>
                </div>
                <div className="score-item">
                  <div className={`score-value ${getScoreColor(driver.performanceScore)}`}>
                    {driver.performanceScore}%
                  </div>
                  <div className="score-label">Performance</div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>📜 License Expiry</span>
                  <span className={`badge ${licenseExpired ? 'badge-danger' : 'badge-success'}`}>
                    {driver.licenseExpiry}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>⚠️ Incidents</span>
                  <span className={`badge ${driver.incidents === 0 ? 'badge-success' : 'badge-warning'}`}>
                    {driver.incidents}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>🚫 Violations</span>
                  <span className={`badge ${driver.violations === 0 ? 'badge-success' : 'badge-danger'}`}>
                    {driver.violations}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>📅 Last Trip</span>
                  <span>{driver.lastTripDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>✅ Completion Rate</span>
                  <strong>{driver.onTimeDelivery}%</strong>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => openDetails(driver)}
                disabled={licenseExpired}
                title={licenseExpired ? 'Cannot view - License Expired' : 'View Full Profile'}
              >
                {licenseExpired ? '🚫 License Expired' : 'View Full Profile'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">👨‍✈️</div>
            <div className="empty-state-text">No drivers found</div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {showModal && selectedDriver && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="modal-title">👨‍✈️ {selectedDriver.name} - Complete Profile</h2>
              <button className="btn btn-sm btn-danger" onClick={closeModal}>✖</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="driver-photo" style={{ fontSize: '5rem', width: '120px', height: '120px' }}>
                  {selectedDriver.photo}
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{selectedDriver.name}</h3>
                  <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    🆔 Driver ID: <strong>{selectedDriver.driverId}</strong>
                  </p>
                  <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    📧 {selectedDriver.email}
                  </p>
                  <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    📞 {selectedDriver.phone}
                  </p>
                  <p style={{ marginTop: '1rem' }}>
                    <span className={`badge badge-${selectedDriver.status === 'Active' ? 'success' : 'warning'}`}>
                      {selectedDriver.status}
                    </span>
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ margin: 0 }}>
                  <h4 style={{ marginBottom: '1rem' }}>🛡️ Safety & Compliance</h4>
                  <div className="progress-bar">
                    <div className={`progress-fill ${getScoreColor(selectedDriver.safetyScore)}`} style={{ width: `${selectedDriver.safetyScore}%` }}></div>
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>Safety Score: <strong>{selectedDriver.safetyScore}%</strong></p>
                  
                  <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid var(--border)' }} />
                  
                  <p style={{ marginBottom: '0.5rem' }}>
                    📜 License: <strong>{selectedDriver.licenseNumber}</strong>
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    📅 Expires: <strong>{selectedDriver.licenseExpiry}</strong>
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    ⚠️ Incidents: <span className={`badge ${selectedDriver.incidents === 0 ? 'badge-success' : 'badge-warning'}`}>{selectedDriver.incidents}</span>
                  </p>
                  <p>
                    🚫 Violations: <span className={`badge ${selectedDriver.violations === 0 ? 'badge-success' : 'badge-danger'}`}>{selectedDriver.violations}</span>
                  </p>
                </div>

                <div className="card" style={{ margin: 0 }}>
                  <h4 style={{ marginBottom: '1rem' }}>⭐ Performance Metrics</h4>
                  <div className="progress-bar">
                    <div className={`progress-fill ${getScoreColor(selectedDriver.performanceScore)}`} style={{ width: `${selectedDriver.performanceScore}%` }}></div>
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>Performance Score: <strong>{selectedDriver.performanceScore}%</strong></p>
                  
                  <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid var(--border)' }} />
                  
                  <p style={{ marginBottom: '0.5rem' }}>
                    📦 Total Trips: <strong>{selectedDriver.totalTrips}</strong>
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    ⏰ On-Time: <strong>{selectedDriver.onTimeDelivery}%</strong>
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    ⛽ Fuel Eff.: <strong>{selectedDriver.fuelEfficiency} km/L</strong>
                  </p>
                  <p>
                    ⭐ Rating: <strong>{selectedDriver.avgRating}/5.0</strong>
                  </p>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <h4 style={{ marginBottom: '1rem' }}>🚛 Current Assignment</h4>
                <p style={{ marginBottom: '0.5rem' }}>
                  📅 Experience: <strong>{selectedDriver.experience} years</strong>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  🚛 Current Vehicle: <strong>{selectedDriver.currentVehicle || 'Not Assigned'}</strong>
                </p>
                <p>
                  📅 Last Trip: <strong>{selectedDriver.lastTripDate}</strong>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverPerformance
