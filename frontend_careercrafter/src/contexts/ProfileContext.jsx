import { createContext, useContext, useEffect, useState } from 'react'
import { getMyProfileApi } from '../api/profileApi'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await getMyProfileApi()
        setProfile(data)
        setError('')
      } catch (err) {
        setError(
          err?.response?.data?.message || 'Failed to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const reload = async () => {
    setLoading(true)
    try {
      const { data } = await getMyProfileApi()
      setProfile(data)
      setError('')
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to reload profile'
      )
    } finally {
      setLoading(false)
    }
  }

  const role = profile?.role ? profile.role.toLowerCase() : localStorage.getItem('role')?.toLowerCase() || 'job_seeker'
  const email = profile?.email || localStorage.getItem('email') || ''

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, loading, error, reload, role, email }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider')
  }
  return context
}
