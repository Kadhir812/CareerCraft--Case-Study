import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import { getMyApplications } from '../../api/applicationApi'
import { searchJobsApi } from '../../api/jobsApi'

import { useProfile } from '../../contexts/ProfileContext'

import './Dashboard.css'

const statusColor = {
  APPLIED: 'badge-gray',
  UNDER_REVIEW: 'badge-blue',
  SHORTLISTED: 'badge-green',
  OFFER_EXTENDED: 'badge-green',
  REJECTED: 'badge-orange',
}

const statusLabels = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  OFFER_EXTENDED: 'Offer Extended',
  REJECTED: 'Rejected',
}

function normalizeStatus(status) {
  if (!status) return 'APPLIED'
  const normalized = String(status).trim().toUpperCase().replace(/[\s-]+/g, '_')
  if (normalized === 'UNDERREVIEW') return 'UNDER_REVIEW'
  if (normalized === 'OFFER') return 'OFFER_EXTENDED'
  return normalized
}

function toDisplayDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

export default function JobSeekerDashboard() {
  const { profile } = useProfile()

  const [loadError, setLoadError] = useState('')
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)

  const fullName = useMemo(() => {
    if (profile?.firstName || profile?.lastName) {
      return [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
    }
    return ''
  }, [profile])

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoadError('')
        const { data } = await getMyApplications()
        const appList = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : []
        setApplications(appList)
      } catch (err) {
        console.error('Failed to load applications', err)
        setLoadError(err?.response?.data?.message || 'Failed to load your applications.')
      } finally {
        setLoadingApps(false)
      }
    }
    loadApplications()
  }, [])

  useEffect(() => {
    async function loadJobs() {
      try {
        const { content } = await searchJobsApi({ page: 0, size: 100 })
        setJobs(Array.isArray(content) ? content : [])
      } catch (err) {
        console.error('Failed to load jobs', err)
        setLoadError((prev) => prev || 'Some dashboard sections could not be loaded.')
      } finally {
        setLoadingJobs(false)
      }
    }
    loadJobs()
  }, [])

  const greetingName = useMemo(() => {
    if (fullName) return fullName
    const email = profile?.email || localStorage.getItem('email') || ''
    return email.split('@')[0] || 'there'
  }, [fullName, profile?.email])

  return (
    <div className="page-wrapper">
      <Navbar role="seeker" />
      <main className="main-content">

        {/* Hero greeting */}
        <div className="dash-hero">
          <div>
            <h1>Good morning, {greetingName}</h1>
            <p>Here's a summary of your job search activity.</p>
            {loadError && <small style={{ color: '#b42318' }}>{loadError}</small>}
          </div>
          <Link to="/jobs">
            <Button size="md">Browse Jobs</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {([
            { label: 'Applications Sent', value: applications.length },
            { label: 'Shortlisted', value: applications.filter((a) => normalizeStatus(a.status) === 'SHORTLISTED').length },
            { label: 'Jobs Available', value: jobs.length },
            { label: 'Profile Views', value: 14 },
          ]).map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Applications */}
        <section className="dash-section">
          <div className="section-header">
            <h2>My Applications</h2>
          </div>
          <div className="applications-table-wrap">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingApps && (
                  <tr>
                    <td colSpan={4}>Loading applications...</td>
                  </tr>
                )}
                {!loadingApps && applications.length === 0 && (
                  <tr>
                    <td colSpan={4}>No applications yet. Start applying to jobs.</td>
                  </tr>
                )}
                {!loadingApps && applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <Link to={app.jobId ? `/jobs/${app.jobId}?from=seeker` : '/jobs'} style={{ fontWeight: 500 }}>
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td>{app.companyName}</td>
                    <td>{toDisplayDate(app.appliedDate || app.date)}</td>
                    <td>
                      <Link to={app.jobId ? `/jobs/${app.jobId}?from=seeker` : '/jobs'}>
                        <span className={`badge ${statusColor[normalizeStatus(app.status)] || 'badge-gray'}`}>
                          {statusLabels[normalizeStatus(app.status)] || app.status}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="dash-section">
          <div className="section-header">
            <h2>Recommended for You</h2>
            <Link to="/jobs" className="see-all">See all →</Link>
          </div>
          <div className="dash-jobs-grid">
            {loadingJobs && <p>Loading recommendations...</p>}
            {!loadingJobs && jobs.slice(0, 3).map(job => (
              <div key={job.id} className="dash-job-card">
                <div className="djc-top">
                  <div className="djc-avatar">{(job.company || 'E').charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="djc-title">{job.title}</div>
                    <div className="djc-company">{job.company}</div>
                  </div>
                </div>
                <div className="djc-meta">
                  <span>📍 {job.location}</span>
                  <span className={`badge ${job.type === 'Full-time' ? 'badge-blue' : 'badge-orange'}`}>{job.type}</span>
                </div>
                <div className="djc-salary">{job.salary}</div>
                <Link to={`/jobs/${job.id}?from=seeker`}>
                  <Button size="sm" variant="secondary" fullWidth>View Details</Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}