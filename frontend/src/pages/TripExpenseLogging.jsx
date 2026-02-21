import { useState } from 'react'
import { FaTruck, FaDollarSign, FaPlus, FaEdit, FaTrash, FaSearch, FaRoute, FaGasPump, FaMoneyBillWave, FaFileInvoiceDollar, FaTools, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { tripsData, expensesData } from '../data/mockData'

function TripExpenseLogging() {
  const [trips, setTrips] = useState(tripsData)
  const [expenses, setExpenses] = useState(expensesData)
  const [activeTab, setActiveTab] = useState('trips') // 'trips' or 'expenses'
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'trip' or 'expense'
  const [editingItem, setEditingItem] = useState(null)
  
  const [tripForm, setTripForm] = useState({
    tripId: '',
    vehicleId: '',
    vehicleName: '',
    driverName: '',
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: '',
    distance: '',
    duration: '',
    fuelUsed: '',
    fuelCost: '',
    avgSpeed: '',
    status: 'Completed',
    cargo: '',
    cargoWeight: ''
  })

  const [expenseForm, setExpenseForm] = useState({
    tripId: '',
    vehicleId: '',
    category: 'Fuel',
    amount: '',
    date: '',
    description: '',
    paymentMethod: 'Company Card',
    receipt: true
  })

  // Filter trips
  const filteredTrips = trips.filter(trip =>
    trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.endLocation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter expenses
  const filteredExpenses = expenses.filter(exp =>
    exp.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Trip functions
  const openAddTripModal = () => {
    setModalType('trip')
    setEditingItem(null)
    setTripForm({
      tripId: `TRP-2026-${String(trips.length + 1).padStart(3, '0')}`,
      vehicleId: '',
      vehicleName: '',
      driverName: '',
      startLocation: '',
      endLocation: '',
      startDate: '',
      endDate: '',
      distance: '',
      duration: '',
      fuelUsed: '',
      fuelCost: '',
      avgSpeed: '',
      status: 'Completed',
      cargo: '',
      cargoWeight: ''
    })
    setShowModal(true)
  }

  const openEditTripModal = (trip) => {
    setModalType('trip')
    setEditingItem(trip)
    setTripForm(trip)
    setShowModal(true)
  }

  const handleTripInputChange = (e) => {
    const { name, value } = e.target
    setTripForm(prev => ({ ...prev, [name]: value }))
  }

  const handleTripSubmit = () => {
    // Basic validation
    if (!tripForm.vehicleId || !tripForm.startLocation || !tripForm.endLocation) {
      alert('Please fill in required fields: Vehicle ID, Start Location, End Location');
      return;
    }

    if (editingItem) {
      const updated = trips.map(t => t.id === editingItem.id ? { ...tripForm, id: t.id } : t)
      setTrips(updated)
      alert('Trip record updated successfully!');
    } else {
      const newTrip = { ...tripForm, id: trips.length + 1 }
      setTrips([newTrip, ...trips])
      alert('Trip logged successfully!');
    }
    closeModal()
  }

  const handleDeleteTrip = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(t => t.id !== id))
    }
  }

  // Expense functions
  const openAddExpenseModal = () => {
    setModalType('expense')
    setEditingItem(null)
    setExpenseForm({
      tripId: '',
      vehicleId: '',
      category: 'Fuel',
      amount: '',
      date: '',
      description: '',
      paymentMethod: 'Company Card',
      receipt: true
    })
    setShowModal(true)
  }

  const openEditExpenseModal = (expense) => {
    setModalType('expense')
    setEditingItem(expense)
    setExpenseForm(expense)
    setShowModal(true)
  }

  const handleExpenseInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setExpenseForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleExpenseSubmit = () => {
    // Validation
    if (!expenseForm.vehicleId || !expenseForm.amount || !expenseForm.date) {
      alert('Please fill in: Vehicle ID, Amount, and Date');
      return;
    }

    if (editingItem) {
      const updated = expenses.map(e => e.id === editingItem.id ? { ...expenseForm, id: e.id } : e)
      setExpenses(updated)
      alert('Expense updated! Operational cost automatically recalculated.');
    } else {
      const newExpense = { ...expenseForm, id: expenses.length + 1, amount: parseFloat(expenseForm.amount) }
      setExpenses([newExpense, ...expenses])
      
      // Show calculation update
      const costs = getVehicleOperationalCost(expenseForm.vehicleId);
      console.log(`Updated operational cost for ${expenseForm.vehicleId}:`, costs);
      alert(`Expense logged! Total operational cost for ${expenseForm.vehicleId}: $${costs.total + parseFloat(expenseForm.amount)}`);
    }
    closeModal()
  }

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  // Calculate operational costs per vehicle
  const getVehicleOperationalCost = (vehicleId) => {
    const fuelCost = expenses
      .filter(e => e.vehicleId === vehicleId && e.category === 'Fuel')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const maintenanceCost = expenses
      .filter(e => e.vehicleId === vehicleId && e.category === 'Maintenance')
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      fuel: fuelCost,
      maintenance: maintenanceCost,
      total: fuelCost + maintenanceCost
    };
  };

  // Statistics
  const stats = {
    totalTrips: trips.length,
    totalDistance: trips.reduce((sum, t) => sum + t.distance, 0),
    totalFuel: trips.reduce((sum, t) => sum + t.fuelUsed, 0),
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    fuelExpenses: expenses.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0),
    maintenanceExpenses: expenses.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0),
    avgFuelEfficiency: (trips.reduce((sum, t) => sum + t.distance, 0) / trips.reduce((sum, t) => sum + t.fuelUsed, 0)).toFixed(2)
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><FaTruck /> Trips & Expense Logging</h1>
        <p className="page-subtitle">Track completed trips, fuel consumption, and operational expenses</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaTruck /></div>
          <div className="stat-label">Total Trips</div>
          <div className="stat-value">{stats.totalTrips}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaRoute /></div>
          <div className="stat-label">Total Distance</div>
          <div className="stat-value">{stats.totalDistance.toLocaleString()} km</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaGasPump /></div>
          <div className="stat-label">Total Fuel Used</div>
          <div className="stat-value">{stats.totalFuel.toLocaleString()} L</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><FaGasPump /></div>
          <div className="stat-label">Avg Fuel Efficiency</div>
          <div className="stat-value">{stats.avgFuelEfficiency} km/L</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${stats.totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2">
          <button
            className={`btn ${activeTab === 'trips' ? 'btn-primary' : 'btn-success'}`}
            onClick={() => setActiveTab('trips')}
          >
            🚛 Trips
          </button>
          <button
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-success'}`}
            onClick={() => setActiveTab('expenses')}
          >
            💰 Expenses
          </button>
        </div>
      </div>

      {/* Search and Add */}
      <div className="card">
        <div className="search-filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'trips' ? 'Search trips...' : 'Search expenses...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={activeTab === 'trips' ? openAddTripModal : openAddExpenseModal}
          >
            ➕ Add {activeTab === 'trips' ? 'New Trip' : 'New Expense'}
          </button>
        </div>
      </div>

      {/* Vehicle Operational Cost Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FaMoneyBillWave /> Total Operational Cost per Vehicle</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', margin: 0 }}>
            Automated calculation: Fuel + Maintenance costs
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[...new Set(expenses.map(e => e.vehicleId))].map(vehicleId => {
            const costs = getVehicleOperationalCost(vehicleId);
            return (
              <div key={vehicleId} style={{ 
                padding: '1rem', 
                background: 'var(--light)', 
                borderRadius: 'var(--radius)',
                border: '2px solid var(--border)'
              }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}><FaTruck /> {vehicleId}</h4>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)' }}><FaGasPump /> Fuel:</span> 
                  <strong style={{ float: 'right' }}>${costs.fuel}</strong>
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)' }}><FaTools /> Maintenance:</span> 
                  <strong style={{ float: 'right' }}>${costs.maintenance}</strong>
                </div>

                <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  <span>Total Cost:</span> 
                  <span style={{ float: 'right', color: 'var(--primary)' }}>${costs.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trips Table */}
      {activeTab === 'trips' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><FaRoute /> Completed Trips</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Distance</th>
                  <th>Fuel Used</th>
                  <th>Fuel Cost</th>
                  <th>Cargo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <div className="empty-state">
                        <div className="empty-state-icon"><FaTruck /></div>
                        <div className="empty-state-text">No trips found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td><strong>{trip.tripId}</strong></td>
                      <td>{trip.vehicleName}</td>
                      <td>{trip.driverName}</td>
                      <td>
                        <div>{trip.startLocation} →</div>
                        <div>{trip.endLocation}</div>
                      </td>
                      <td>{trip.startDate.split(' ')[0]}</td>
                      <td>{trip.distance} km</td>
                      <td>{trip.fuelUsed} L</td>
                      <td><strong>${trip.fuelCost}</strong></td>
                      <td>
                        <div>{trip.cargo}</div>
                        <small>{trip.cargoWeight} kg</small>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => openEditTripModal(trip)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteTrip(trip.id)}
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
      )}

      {/* Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><FaFileInvoiceDollar /> Expense Records</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip ID</th>
                  <th>Vehicle ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <div className="empty-state">
                        <div className="empty-state-icon"><FaDollarSign /></div>
                        <div className="empty-state-text">No expenses found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.date}</td>
                      <td>{expense.tripId || 'N/A'}</td>
                      <td>{expense.vehicleId}</td>
                      <td>
                        <span className={`badge badge-${
                          expense.category === 'Fuel' ? 'warning' :
                          expense.category === 'Maintenance' ? 'danger' :
                          expense.category === 'Toll' ? 'info' : 'primary'
                        }`}>
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.description}</td>
                      <td><strong>${expense.amount}</strong></td>
                      <td>{expense.paymentMethod}</td>
                      <td>{expense.receipt ? <FaCheckCircle style={{color: 'var(--success)'}} /> : <FaTimesCircle style={{color: 'var(--danger)'}} />}</td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => openEditExpenseModal(expense)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteExpense(expense.id)}
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
      )}

      {/* Modal for Trip */}
      {showModal && modalType === 'trip' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? '✏️ Edit Trip' : '➕ Add New Trip'}
              </h2>
              <button className="btn btn-sm btn-danger" onClick={closeModal}>✖</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Trip ID</label>
                <input
                  type="text"
                  className="form-input"
                  name="tripId"
                  value={tripForm.tripId}
                  onChange={handleTripInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle ID</label>
                <input
                  type="text"
                  className="form-input"
                  name="vehicleId"
                  value={tripForm.vehicleId}
                  onChange={handleTripInputChange}
                  placeholder="FL-2024-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Name</label>
                <input
                  type="text"
                  className="form-input"
                  name="vehicleName"
                  value={tripForm.vehicleName}
                  onChange={handleTripInputChange}
                  placeholder="Volvo FH16"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Driver Name</label>
                <input
                  type="text"
                  className="form-input"
                  name="driverName"
                  value={tripForm.driverName}
                  onChange={handleTripInputChange}
                  placeholder="James Anderson"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Location</label>
                <input
                  type="text"
                  className="form-input"
                  name="startLocation"
                  value={tripForm.startLocation}
                  onChange={handleTripInputChange}
                  placeholder="New York, NY"
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Location</label>
                <input
                  type="text"
                  className="form-input"
                  name="endLocation"
                  value={tripForm.endLocation}
                  onChange={handleTripInputChange}
                  placeholder="Boston, MA"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  name="startDate"
                  value={tripForm.startDate}
                  onChange={handleTripInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  name="endDate"
                  value={tripForm.endDate}
                  onChange={handleTripInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input
                  type="number"
                  className="form-input"
                  name="distance"
                  value={tripForm.distance}
                  onChange={handleTripInputChange}
                  placeholder="215"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fuel Used (L)</label>
                <input
                  type="number"
                  className="form-input"
                  name="fuelUsed"
                  value={tripForm.fuelUsed}
                  onChange={handleTripInputChange}
                  placeholder="45"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fuel Cost ($)</label>
                <input
                  type="number"
                  className="form-input"
                  name="fuelCost"
                  value={tripForm.fuelCost}
                  onChange={handleTripInputChange}
                  placeholder="180"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cargo Description</label>
                <input
                  type="text"
                  className="form-input"
                  name="cargo"
                  value={tripForm.cargo}
                  onChange={handleTripInputChange}
                  placeholder="Electronics"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cargo Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  name="cargoWeight"
                  value={tripForm.cargoWeight}
                  onChange={handleTripInputChange}
                  placeholder="12000"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleTripSubmit}>
                {editingItem ? 'Update Trip' : 'Add Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Expense */}
      {showModal && modalType === 'expense' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? '✏️ Edit Expense' : '➕ Add New Expense'}
              </h2>
              <button className="btn btn-sm btn-danger" onClick={closeModal}>✖</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Trip ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  name="tripId"
                  value={expenseForm.tripId}
                  onChange={handleExpenseInputChange}
                  placeholder="TRP-2026-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle ID</label>
                <input
                  type="text"
                  className="form-input"
                  name="vehicleId"
                  value={expenseForm.vehicleId}
                  onChange={handleExpenseInputChange}
                  placeholder="FL-2024-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={expenseForm.category} onChange={handleExpenseInputChange}>
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Toll">Toll</option>
                  <option value="Parking">Parking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input
                  type="number"
                  className="form-input"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={handleExpenseInputChange}
                  placeholder="180"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  name="date"
                  value={expenseForm.date}
                  onChange={handleExpenseInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  name="description"
                  value={expenseForm.description}
                  onChange={handleExpenseInputChange}
                  placeholder="Diesel Refuel - Shell Station"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select" name="paymentMethod" value={expenseForm.paymentMethod} onChange={handleExpenseInputChange}>
                  <option value="Company Card">Company Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Personal Card">Personal Card</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="receipt"
                    checked={expenseForm.receipt}
                    onChange={handleExpenseInputChange}
                    style={{ width: 'auto' }}
                  />
                  Receipt Available
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleExpenseSubmit}>
                {editingItem ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripExpenseLogging
