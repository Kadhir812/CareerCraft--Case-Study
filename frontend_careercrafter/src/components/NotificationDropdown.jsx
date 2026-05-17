import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotificationsApi } from '../api/notificationApi'
import './NotificationDropdown.css'

function formatType(type) {
  return (type || 'Notification').replace(/_/g, ' ')
}

function formatTime(value) {
  if (!value) return ''

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
}

export default function NotificationDropdown() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) return

    async function loadNotifications() {
      try {
        setLoading(true)
        const { data } = await getNotificationsApi()
        setNotifications(Array.isArray(data) ? data : [])
        setError('')
        setHasLoaded(true)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load notifications.')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [open])

  function handleNotifClick(e, notification) {
    e.stopPropagation()
    setOpen(false)
    if (notification.targetRoute) {
      navigate(notification.targetRoute)
    }
  }

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button className="notif-button" onClick={() => setOpen(!open)} aria-label="Notifications">
        <span aria-hidden="true">&#128276;</span>
        {hasLoaded && notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-empty">Loading notifications...</div>
            ) : error ? (
              <div className="notif-empty notif-error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet.</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="notif-item"
                  onClick={(e) => handleNotifClick(e, notification)}
                >
                  <div className="notif-title">{formatType(notification.type)}</div>
                  <div className="notif-desc">{notification.message}</div>
                  <div className="notif-time">{formatTime(notification.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}