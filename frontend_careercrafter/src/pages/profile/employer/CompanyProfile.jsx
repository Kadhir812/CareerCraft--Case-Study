import { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Button from '../../../components/Button'
import { getMyEmployerProfileApi, updateMyEmployerProfileApi } from "../../../api/profileApi"
import "../UserProfile.css"

 const CompanyProfile = () => {
  const [employer, setEmployer] = useState({
    contactFirstName: '',
    contactLastName: '',
    companyName: '',
    industry: '',
    website: '',
    verifiedStatus: 'PENDING',
    email: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      try {
        const { data } = await getMyEmployerProfileApi()
        setEmployer({
          contactFirstName: data.contactFirstName || '',
          contactLastName: data.contactLastName || '',
          companyName: data.companyName || '',
          industry: data.industry || '',
          website: data.website || '',
          verifiedStatus: data.verifiedStatus || 'PENDING',
          email: data.email || '',
        })
        setError('')
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load company profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setEmployer(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const payload = {
        contactFirstName: employer.contactFirstName,
        contactLastName: employer.contactLastName,
        companyName: employer.companyName,
        industry: employer.industry,
        website: employer.website,
      }

      const { data } = await updateMyEmployerProfileApi(payload)
      setEmployer(prev => ({
        ...prev,
        contactFirstName: data.contactFirstName || '',
        contactLastName: data.contactLastName || '',
        companyName: data.companyName || '',
        industry: data.industry || '',
        website: data.website || '',
        email: data.email || prev.email,
      }))
      setError('')
      setIsEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save company profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <Navbar role="employer" />
        <main className="main-content">
          <div className="profile-container">
            <div className="profile-card">Loading company profile...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar role="employer" />
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Company Profile</h1>
            <p>Manage your company information as seen by job seekers.</p>
          </div>
          <div className="profile-card">
            {error && <p style={{ color: '#b42318', marginBottom: 12 }}>{error}</p>}
            <div className="form-group">
              <label>Contact First Name</label>
              <input
                type="text"
                name="contactFirstName"
                className="form-input"
                value={employer.contactFirstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Contact Last Name</label>
              <input
                type="text"
                name="contactLastName"
                className="form-input"
                value={employer.contactLastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={employer.companyName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                className="form-input"
                value={employer.industry}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                className="form-input"
                value={employer.website}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={employer.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Verification Status</label>
              <input
                type="text"
                name="verifiedStatus"
                className="form-input"
                value={employer.verifiedStatus}
                disabled
              />
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Company Profile</Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CompanyProfile