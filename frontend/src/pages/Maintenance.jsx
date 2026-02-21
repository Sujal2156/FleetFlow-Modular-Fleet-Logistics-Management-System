import { useEffect, useState } from 'react'
import { maintenanceService } from '../services/api'

function Maintenance() {
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceService.getAll()
      setMaintenance(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching maintenance:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Maintenance Logs</h1>
      
      <div className="card">
        <button className="btn btn-primary">Add New Maintenance</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Cost</th>
              <th>Mileage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No maintenance records found</td>
              </tr>
            ) : (
              maintenance.map((record) => (
                <tr key={record._id}>
                  <td>{record.type}</td>
                  <td>{record.description}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>${record.cost}</td>
                  <td>{record.mileage}</td>
                  <td>{record.status}</td>
                  <td>
                    <button className="btn btn-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Maintenance
