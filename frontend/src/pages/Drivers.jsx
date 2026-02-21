import { useEffect, useState } from 'react'
import { driverService } from '../services/api'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      const response = await driverService.getAll()
      setDrivers(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching drivers:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Drivers</h1>
      
      <div className="card">
        <button className="btn btn-primary">Add New Driver</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No drivers found</td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.name}</td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.licenseNumber}</td>
                  <td>{driver.status}</td>
                  <td>{driver.performanceRating}/5</td>
                  <td>
                    <button className="btn btn-sm">Edit</button>
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

export default Drivers
