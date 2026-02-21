import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import MaintenanceLogs from './pages/MaintenanceLogs'
import TripExpenseLogging from './pages/TripExpenseLogging'
import DriverPerformance from './pages/DriverPerformance'
import OperationalAnalytics from './pages/OperationalAnalytics'

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Maintenance & Service', icon: '🔧' },
    { path: '/trips', label: 'Trips & Expenses', icon: '🚛' },
    { path: '/drivers', label: 'Driver Performance', icon: '👨‍✈️' },
    { path: '/analytics', label: 'Analytics & Reports', icon: '📊' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>🚛 FleetFlow</h1>
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
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MaintenanceLogs />} />
            <Route path="/trips" element={<TripExpenseLogging />} />
            <Route path="/drivers" element={<DriverPerformance />} />
            <Route path="/analytics" element={<OperationalAnalytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
