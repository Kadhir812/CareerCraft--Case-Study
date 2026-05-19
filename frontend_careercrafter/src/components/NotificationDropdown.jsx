import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getNotificationsApi } from '../api/notificationApi'

import './NotificationDropdown.css'

const LAST_VIEWED_STORAGE_KEY = 'notifications:lastViewedAt'

const formatType = type =>
  (type || 'Notification').replace(/_/g, ' ')

const formatTime = value => {
  if (!value) return ''

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString()
}

const getNotificationTime = notification => {
  const value = notification?.createdAt || notification?.date || notification?.time
  const time = new Date(value)

  return Number.isNaN(time.getTime()) ? 0 : time.getTime()
}

export default function NotificationDropdown() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)
  const [lastViewedAt, setLastViewedAt] = useState(() => {
    const savedValue = localStorage.getItem(LAST_VIEWED_STORAGE_KEY)
    return savedValue ? Number(savedValue) : 0
  })

  const unreadCount = notifications.filter(notification => {
    const isUnreadFlag = notification?.isRead === false || notification?.seen === false || notification?.read === false
    if (isUnreadFlag) return true

    const notificationTime = getNotificationTime(notification)
    return notificationTime > lastViewedAt
  }).length

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [])

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)

        const { data } = await getNotificationsApi()

        setNotifications(
          Array.isArray(data) ? data : []
        )

        setError('')
        setHasLoaded(true)
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            'Failed to load notifications.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const handleNotifClick = notification => {
    setOpen(false)

    if (notification.targetRoute) {
      navigate(notification.targetRoute)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="notif-empty">
          Loading notifications...
        </div>
      )
    }

    if (error) {
      return (
        <div className="notif-empty notif-error">
          {error}
        </div>
      )
    }

    if (!notifications.length) {
      return (
        <div className="notif-empty">
          No notifications yet.
        </div>
      )
    }

    return notifications.map(notification => (
      <div
        key={notification.id}
        className="notif-item"
        onClick={() => handleNotifClick(notification)}
      >
        <div className="notif-title">
          {formatType(notification.type)}
        </div>

        <div className="notif-desc">
          {notification.message}
        </div>

        <div className="notif-time">
          {formatTime(notification.createdAt)}
        </div>
      </div>
    ))
  }

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button
        className="notif-button"
        onClick={() => {
          const nextOpen = !open

          if (nextOpen) {
            const viewedAt = Date.now()
            setLastViewedAt(viewedAt)
            localStorage.setItem(LAST_VIEWED_STORAGE_KEY, String(viewedAt))
          }

          setOpen(nextOpen)
        }}
        aria-label="Notifications"
      >
        <span aria-hidden="true">&#128276;</span>

        {hasLoaded && unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
          </div>

          <div className="notif-list">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  )
}