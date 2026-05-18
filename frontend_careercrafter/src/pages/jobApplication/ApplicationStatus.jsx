import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'

import { getMyApplications } from '../../api/applicationApi'

import './JobApplicationStatus.css'

const steps = [
  {
    id: 'APPLIED',
    label: 'Application Submitted',
    desc: 'We have received your application.',
  },
  {
    id: 'UNDER_REVIEW',
    label: 'Under Review',
    desc: 'The hiring team is reviewing your profile.',
  },
  {
    id: 'SHORTLISTED',
    label: 'Shortlisted',
    desc: 'Congratulations! You have been shortlisted for an interview.',
  },
  {
    id: 'OFFER_EXTENDED',
    label: 'Offer Extended',
    desc: 'An offer has been made to you.',
  },
]

const statusLabels = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  OFFER_EXTENDED: 'Offer Extended',
  REJECTED: 'Rejected',
}

const normalizeStatus = status => {
  if (!status) return 'APPLIED'

  const normalized = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

  if (normalized === 'OFFER') return 'OFFER_EXTENDED'
  if (normalized === 'UNDERREVIEW') return 'UNDER_REVIEW'

  return normalized
}

const getStatusLabel = status =>
  statusLabels[normalizeStatus(status)] ||
  status ||
  'Applied'

const getStatusBadge = status => {
  const normalized = normalizeStatus(status)

  if (
    normalized === 'SHORTLISTED' ||
    normalized === 'OFFER_EXTENDED'
  ) {
    return 'badge-green'
  }

  if (normalized === 'REJECTED') {
    return 'badge-orange'
  }

  if (normalized === 'UNDER_REVIEW') {
    return 'badge-blue'
  }

  return 'badge-gray'
}

export default function ApplicationStatus() {
  const { id } = useParams()

  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true)

        const { data } = await getMyApplications()

        setApp(
          data.find(a => String(a.id) === id) || null
        )

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

    fetchApp()
  }, [id])

  const renderPage = content => (
    <div className="page-wrapper">
      <Navbar role="seeker" />
      <main className="main-content">{content}</main>
      <Footer />
    </div>
  )

  if (loading) {
    return renderPage(<p>Loading...</p>)
  }

  if (error || !app) {
    return renderPage(
      <div
        style={{
          textAlign: 'center',
          padding: '100px 0',
        }}
      >
        <h2>Application Not Found</h2>

        {error && (
          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '8px',
            }}
          >
            {error}
          </p>
        )}

        <Button
          onClick={() => window.history.back()}
          style={{ marginTop: '20px' }}
        >
          Go Back
        </Button>
      </div>
    )
  }

  const normalizedStatus = normalizeStatus(app.status)
  const isRejected = normalizedStatus === 'REJECTED'

  let currentIndex = steps.findIndex(
    step => step.id === normalizedStatus
  )

  if (isRejected) {
    currentIndex = steps.findIndex(
      step => step.id === 'SHORTLISTED'
    )
  }

  if (currentIndex === -1) {
    currentIndex = 0
  }

  return renderPage(
    <div className="app-status-container">
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/dashboard/seeker"
          style={{ color: 'var(--text-muted)' }}
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="status-card">
        <div className="status-header">
          <h1 className="status-job-title">
            {app.jobTitle || 'Application Status'}
          </h1>

          <div className="status-company">
            {app.companyName ||
              'Company not available'}
          </div>

          <div className="status-meta">
            <span>
              Applied:{' '}
              {app.appliedDate
                ? app.appliedDate.slice(0, 10)
                : 'N/A'}
            </span>

            <span
              className={`badge ${getStatusBadge(
                app.status
              )}`}
            >
              Current Status:{' '}
              {getStatusLabel(app.status)}
            </span>
          </div>
        </div>

        <div className="timeline-container">
          <h2>Application Timeline</h2>

          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '32px',
            }}
          >
            Track the progress of your application
            below.
          </p>

          <div className="timeline">
            {steps.map((step, idx) => {
              if (isRejected && idx > currentIndex) {
                return null
              }

              let statusClass = ''

              if (idx < currentIndex) {
                statusClass = 'completed'
              } else if (idx === currentIndex) {
                statusClass = isRejected
                  ? 'completed rejected'
                  : 'active'
              }

              const rejectedStep =
                isRejected && idx === currentIndex

              return (
                <div
                  key={step.id}
                  className={`timeline-step ${statusClass}`}
                >
                  <div className="step-marker"></div>

                  <div className="step-content">
                    <div className="step-title">
                      {rejectedStep
                        ? 'Application Rejected'
                        : step.label}
                    </div>

                    <div className="step-desc">
                      {rejectedStep
                        ? 'Unfortunately, we will not be moving forward with your application at this time.'
                        : step.desc}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}