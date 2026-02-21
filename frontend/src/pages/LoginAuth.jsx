import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaUserShield, FaEnvelope, FaKey, FaUserTie, FaHeadset, FaTruck } from 'react-icons/fa'

const roleOptions = [
  {
    id: 'manager',
    label: 'Manager',
    icon: <FaUserTie />,
    description: 'Full fleet oversight, reports, and approvals.'
  },
  {
    id: 'dispatcher',
    label: 'Dispatcher',
    icon: <FaHeadset />,
    description: 'Trip creation, assignments, and live monitoring.'
  }
]

function LoginAuth({ onLogin }) {
  const [role, setRole] = useState('manager')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onLogin) {
      onLogin(role)
    }
    navigate('/command')
  }

  return (
    <div>
      <div className="page-header auth-header">
        <h1 className="page-title"><FaLock /> Login & Authentication</h1>
        <p className="page-subtitle">
          <span className="subtitle-icon"><FaUserShield /></span>
          Secure access for Manager and Dispatcher roles
          <span className="subtitle-icon"><FaTruck /></span>
        </p>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-left">
            <div className="card auth-form-card">
              <h2 className="section-title"><FaUserShield /> Sign In</h2>
              <p className="auth-subtitle">Sign in with your work email to access your FleetFlow dashboard.</p>

              <form onSubmit={handleSubmit}>
                <div className="role-tabs">
                  {roleOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      className={`role-tab ${role === option.id ? 'active' : ''}`}
                      onClick={() => setRole(option.id)}
                    >
                      <span className="role-tab-icon">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="role-help">
                  {roleOptions.find(option => option.id === role)?.description}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope />
                    <input
                      className="form-input"
                      type="email"
                      placeholder="name@fleetflow.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-with-icon">
                    <FaKey />
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-actions">
                  <button className="btn btn-primary" type="submit">
                    <FaLock /> Sign In
                  </button>
                  <button className="link-button" type="button">
                    Forgot Password
                  </button>
                </div>

                <div className="auth-footer">
                  <span className="badge badge-info">Role: {role}</span>
                  <span className="muted">Access control enforced by policy rules.</span>
                </div>
              </form>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-info">
              <div className="auth-brand"><FaTruck /> FleetFlow</div>
              <p className="auth-copy">Role-based access control for every mission-critical workflow.</p>

              <div className="auth-features">
                <div className="auth-feature"><FaUserShield /> RBAC-enabled login and session profiles.</div>
                <div className="auth-feature"><FaLock /> Secure access for sensitive operations.</div>
                <div className="auth-feature"><FaUserShield /> Activity logging and audit-ready access trails.</div>
              </div>

              <div className="role-panel">
                <div className="role-title">Access Profiles</div>
                <div className="role-description">Choose Manager or Dispatcher at the top of the form to switch permissions.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginAuth
