import { useEffect, useState } from 'react'
import { vehicleService, driverService, tripService } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalDrivers: 0,
    activeTrips: 0,
    totalTrips: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        tripService.getAll()
      ])

      setStats({
        totalVehicles: vehiclesRes.data.length,
        totalDrivers: driversRes.data.length,
        activeTrips: tripsRes.data.filter(t => t.status === 'in-progress').length,
        totalTrips: tripsRes.data.length
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p>{stats.totalVehicles}</p>
        </div>
        <div className="stat-card">
          <h3>Total Drivers</h3>
          <p>{stats.totalDrivers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Trips</h3>
          <p>{stats.activeTrips}</p>
        </div>
        <div className="stat-card">
          <h3>Total Trips</h3>
          <p>{stats.totalTrips}</p>
        </div>
      </div>

      <div className="card">
        <h2>Welcome to FleetFlow</h2>
        <p>Your complete fleet management solution for logistics operations.</p>
      </div>
    </div>
  )
}

export default Dashboard
