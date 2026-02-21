import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { FaTruck, FaTools, FaUserTie, FaChartLine, FaTachometerAlt, FaClipboardList, FaRoute } from 'react-icons/fa'
import './App.css'
import LoginAuth from './pages/LoginAuth'
import CommandCenter from './pages/CommandCenter'
import VehicleRegistry from './pages/VehicleRegistry'
import TripDispatcher from './pages/TripDispatcher'
import MaintenanceLogs from './pages/MaintenanceLogs'
import TripExpenseLogging from './pages/TripExpenseLogging'
import DriverPerformance from './pages/DriverPerformance'
import OperationalAnalytics from './pages/OperationalAnalytics'

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/command', label: 'Command Center', icon: <FaTachometerAlt /> },
    { path: '/registry', label: 'Vehicle Registry', icon: <FaClipboardList /> },
    { path: '/dispatch', label: 'Trip Dispatcher', icon: <FaRoute /> },
    { path: '/maintenance', label: 'Maintenance & Service', icon: <FaTools /> },
    { path: '/trips', label: 'Trips & Expenses', icon: <FaTruck /> },
    { path: '/drivers', label: 'Driver Performance', icon: <FaUserTie /> },
    { path: '/analytics', label: 'Analytics & Reports', icon: <FaChartLine /> }
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1><FaTruck /> FleetFlow</h1>
        <p>Fleet Management System</p>
      </div>
      <ul className="nav-menu">
        {navItems.map(item => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function App() {
  const [isAuthed, setIsAuthed] = useState(false)

  const handleLogin = () => {
    setIsAuthed(true)
  }

  return (
    <Router>
      <div className="app">
        {isAuthed && <Navigation />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginAuth onLogin={handleLogin} />} />
            <Route path="/command" element={isAuthed ? <CommandCenter /> : <Navigate to="/" replace />} />
            <Route path="/registry" element={isAuthed ? <VehicleRegistry /> : <Navigate to="/" replace />} />
            <Route path="/dispatch" element={isAuthed ? <TripDispatcher /> : <Navigate to="/" replace />} />
            <Route path="/maintenance" element={isAuthed ? <MaintenanceLogs /> : <Navigate to="/" replace />} />
            <Route path="/trips" element={isAuthed ? <TripExpenseLogging /> : <Navigate to="/" replace />} />
            <Route path="/drivers" element={isAuthed ? <DriverPerformance /> : <Navigate to="/" replace />} />
            <Route path="/analytics" element={isAuthed ? <OperationalAnalytics /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
