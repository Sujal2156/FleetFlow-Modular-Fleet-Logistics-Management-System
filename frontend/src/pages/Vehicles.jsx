import { useEffect, useState } from 'react'
import { vehicleService } from '../services/api'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAll()
      setVehicles(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Vehicles</h1>
      
      <div className="card">
        <button className="btn btn-primary">Add New Vehicle</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Type</th>
              <th>Status</th>
              <th>Mileage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No vehicles found</td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.vehicleNumber}</td>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.status}</td>
                  <td>{vehicle.currentMileage}</td>
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

export default Vehicles
