import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'
import { useProfile } from '../contexts/ProfileContext'
import './NavBar.css'

export default function Navbar() {
  const { role: contextRole } = useProfile()
  const role = contextRole === 'employer' ? 'employer' : 'seeker'
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme'
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const seekerLinks = [
    { to: '/dashboard/seeker', label: 'Dashboard' },
    { to: '/jobs?from=seeker', label: 'Find Jobs' },
    { to: '/profile', label: 'Profile' },
  ]

  const employerLinks = [
    { to: '/dashboard/employer', label: 'Dashboard' },
    { to: '/jobs?from=employer', label: 'Browse Jobs' },
    { to: '/company-profile', label: 'Company Profile' },
  ]

  const links = role === 'employer' ? employerLinks : seekerLinks

  const modeToggle = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to={role === 'employer'
            ? '/dashboard/employer'
            : '/dashboard/seeker'}
          className="navbar-logo"
        >
          <span className="logo-icon">⚡</span>
          CareerCrafter
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          {links.map(link => {
            const isJobsLink = link.to.startsWith('/jobs')

            const isActive = isJobsLink
              ? location.pathname === '/jobs' ||
                location.pathname.startsWith('/jobs/')
              : location.pathname === link.to

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}

          <button className="mode-toggle" onClick={modeToggle}>
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>

          <div
            style={{
              marginLeft: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <NotificationDropdown role={role} />
          </div>

          <button
            className="nav-logout"
            onClick={() => {
              setMenuOpen(false)
              navigate('/login')
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}