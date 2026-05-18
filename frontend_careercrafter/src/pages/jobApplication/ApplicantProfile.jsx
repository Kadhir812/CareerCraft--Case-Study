import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'

import {
  getApplicationById,
  updateApplicationStatus,
} from '../../api/applicationApi'

import './ApplicantProfile.css'
import '../profile/ResumeBuilder.css'

const statusOptions = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended' },
  { value: 'REJECTED', label: 'Rejected' },
]

const formatStatus = status =>
  statusOptions.find(item => item.value === status)?.label ||
  status ||
  'Not available'

const formatDate = value => {
  if (!value) return 'Not available'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not available'
    : date.toLocaleDateString()
}

export default function ApplicantProfile() {
  const { id } = useParams()

  const [application, setApplication] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true)

        const { data } = await getApplicationById(id)

        setApplication(data)
        setStatus(data.status || 'APPLIED')
        setError('')
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            'Failed to load application.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [id])

  const applicant = application?.seekerProfile || {}

  const detailRows = [
    {
      label: 'Applied Date',
      value: formatDate(application?.appliedDate),
    },
    {
      label: 'Experience Level',
      value: application?.experienceLevel || 'Not provided',
    },
    {
      label: 'Portfolio',
      value: application?.portfolioUrl || 'Not provided',
      href: application?.portfolioUrl,
    },
    {
      label: 'Resume',
      value: application?.resume?.url
        ? 'Open resume'
        : 'No resume attached',
      href: application?.resume?.url,
    },
  ]

  const handleSaveStatus = async () => {
    try {
      setSaving(true)
      setMessage('')

      const { data } = await updateApplicationStatus(id, status)

      setApplication(prev => ({
        ...prev,
        ...data,
        seekerProfile:
          data.seekerProfile || prev?.seekerProfile,
        resume: data.resume || prev?.resume,
      }))

      setStatus(data.status || status)
      setMessage('Status updated and candidate notified.')
      setError('')
    } catch (err) {
      setMessage('')
      setError(
        err?.response?.data?.message ||
          'Unable to update application status.'
      )
    } finally {
      setSaving(false)
    }
  }

  const renderPage = content => (
    <div className="page-wrapper">
      <Navbar role="employer" />
      <main className="main-content">{content}</main>
      <Footer />
    </div>
  )

  if (loading) {
    return renderPage(<p>Loading application...</p>)
  }

  if (!application) {
    return renderPage(
      <div
        style={{
          textAlign: 'center',
          padding: '100px 0',
        }}
      >
        <h2>Application Not Found</h2>

        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: '8px',
          }}
        >
          {error || 'This application could not be loaded.'}
        </p>

        <div style={{ marginTop: '20px' }}>
          <Link to="/dashboard/employer">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const {
    name = 'Candidate Profile',
    email = 'Email not available',
    phone = 'Phone not available',
    location = 'Location not available',
    headline = '',
    id: applicantId,
  } = applicant

  const badgeClass =
    application.status === 'SHORTLISTED'
      ? 'badge-green'
      : application.status === 'REJECTED'
      ? 'badge-orange'
      : 'badge-blue'

  return renderPage(
    <>
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/dashboard/employer"
          style={{ color: 'var(--text-muted)' }}
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="applicant-profile-container">
        <aside className="applicant-sidebar">
          <div
            className="applicant-card"
            style={{ padding: '40px 24px' }}
          >
            <div className="applicant-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <h1 className="applicant-name">{name}</h1>

            {headline && (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                {headline}
              </p>
            )}

            {applicantId ? (
              <Link
                className="view-profile-link"
                to={`/job-seeker/${applicantId}`}
                state={{
                  profile: applicant,
                  applicationId: application.id,
                }}
              >
                View Profile
              </Link>
            ) : (
              <span className="view-profile-disabled">
                Profile link unavailable
              </span>
            )}

            <div className="applicant-role">
              Applied for{' '}
              {application.jobTitle || 'Not available'}
            </div>

            <div style={{ marginTop: '32px' }}>
              <div className="contact-detail">
                <span className="contact-icon">@</span>
                {email}
              </div>

              <div className="contact-detail">
                <span className="contact-icon">Ph</span>
                {phone}
              </div>

              <div className="contact-detail">
                <span className="contact-icon">Loc</span>
                {location}
              </div>
            </div>

            <div className="status-dropdown-wrap">
              <div className={`badge ${badgeClass}`}>
                Current Status:{' '}
                {formatStatus(application.status)}
              </div>

              <label>Update Application Status</label>

              <select
                className="filter-select full-select"
                value={status}
                onChange={e => {
                  setStatus(e.target.value)
                  setMessage('')
                  setError('')
                }}
                disabled={saving}
              >
                {statusOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {message && (
                <p className="applicant-success">
                  {message}
                </p>
              )}

              {error && (
                <p className="applicant-error">{error}</p>
              )}

              <div style={{ marginTop: '16px' }}>
                <Button
                  fullWidth
                  onClick={handleSaveStatus}
                  disabled={
                    saving ||
                    status === application.status
                  }
                >
                  {saving ? 'Saving...' : 'Save Status'}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="applicant-main">
          <div className="applicant-card">
            <div className="section-header">
              <h2>Application Details</h2>
            </div>

            <div className="applicant-details-grid">
              {detailRows.map(row => (
                <div
                  key={row.label}
                  className="applicant-detail-item"
                >
                  <span>{row.label}</span>

                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <strong>{row.value}</strong>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="applicant-card">
            <div className="section-header">
              <h2>Cover Letter</h2>
            </div>

            <p className="applicant-long-text">
              {application.coverLetter ||
                'No cover letter provided.'}
            </p>
          </div>

          <div className="applicant-card">
            <div className="section-header">
              <h2>Job Information</h2>
            </div>

            <div className="entry-card">
              <div className="entry-header">
                <div className="entry-title">
                  {application.jobTitle ||
                    'Not available'}
                </div>
              </div>

              <div className="entry-subtitle">
                {application.companyName ||
                  'Company not available'}
              </div>

              <div className="entry-duration">
                Application ID: {application.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}