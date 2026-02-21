import { useEffect, useState } from 'react'
import { tripService } from '../services/api'

function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await tripService.getAll()
      setTrips(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Trips</h1>
      
      <div className="card">
        <button className="btn btn-primary">Add New Trip</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Distance</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Fuel Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No trips found</td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip._id}>
                  <td>{trip.startLocation}</td>
                  <td>{trip.endLocation}</td>
                  <td>{trip.distance} km</td>
                  <td>{new Date(trip.startDate).toLocaleDateString()}</td>
                  <td>{trip.status}</td>
                  <td>{trip.fuelConsumed} L</td>
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

export default Trips
