import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import { createJobApi, getMyJobsApi, updateJobApi } from '../../api/jobsApi'
import { getApplicationsForJob } from '../../api/applicationApi'
import './Dashboard.css'
import JobPost from '../job/JobPost'

function extractApplicationList(response) {
  const data = response?.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.applications)) return data.applications
  return []
}

export default function EmployerDashboard() {
  const [showJobPost, setShowJobPost] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentApplicants, setRecentApplicants] = useState([])
  const [actionBusy, setActionBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true)
        const result = await getMyJobsApi({ page: 0, size: 100 })
        setJobs(result.content || [])
        setError('')
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  useEffect(() => {
  async function loadApplicants() {
    try {
      if (jobs.length === 0) return

      const allApps = await Promise.all( //Promise.all() runs all requests in parallel i.e get all job.id parallely
        jobs.map(job => getApplicationsForJob(job.id))
      )

      const merged = allApps.flatMap(extractApplicationList)
      const countByJobId = merged.reduce((acc, app) => {
          const jobId = app?.jobId ?? app?.job?.id

          if (jobId != null) {
            acc[jobId] = (acc[jobId] || 0) + 1
          }

          return acc
        }, {})

      merged.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))

      setRecentApplicants(merged)
      setJobs(prev => prev.map(job => ({
        ...job,
        applicants: countByJobId[job.id] || 0,
      })))
    } catch (err) {
      console.error('Failed to load applicants', err)
    }
  }

  loadApplicants()
}, [jobs])

 const employerJobs = jobs

async function handleSaveJob(jobData) {
  try {
    setActionBusy(true)
    if (editingJob) {
      const updated = await updateJobApi(editingJob.id, jobData)

      setJobs(prev =>
        prev.map(j =>
          j.id === editingJob.id
            ? { ...j, ...updated }
            : j
        )
      )

      setEditingJob(null)
    } else {
      const created = await createJobApi(jobData)

      setJobs(prev => [created, ...prev])

      setShowJobPost(false)
    }

    setError('')
  } catch (err) {
    setError(
      err?.response?.data?.message ||
      'Unable to save job'
    )
  } finally {
    setActionBusy(false)
  }
}

  return (
    <div className="page-wrapper">
      <Navbar role="employer" />
      <main className="main-content">

        <div className="dash-hero">
          <div>
            <h1>Employer Dashboard </h1>
            <p>Manage your job postings and review applicants.</p>
          </div>
          <div className="employer-actions">
            <Button size="md" onClick={() => setShowJobPost(true)} disabled={actionBusy}>+ Post a Job</Button>
          </div>
        </div>
        {error && <p style={{ color: '#b42318', marginBottom: '12px' }}>{error}</p>}
        {(showJobPost || editingJob) && (
          <JobPost 
            initialJob={editingJob}
            onSubmit={handleSaveJob} 
            onCancel={() => { setShowJobPost(false); setEditingJob(null) }} 
          />
        )}

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Active Postings', value: employerJobs.filter(j => j.status === 'ACTIVE').length },
            { label: 'Total Applicants', value: employerJobs.reduce((s, j) => s + (j.applicants || 0), 0),},
            { label: 'Shortlisted', value: recentApplicants.filter(a => a.status === 'SHORTLISTED').length},
            { label: 'Closed Jobs', value: employerJobs.filter(j => j.status === 'CLOSED').length},
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Posted jobs */}
        <section className="dash-section">
          <div className="section-header">
            <h2>Posted Jobs</h2>
          </div>
          <div className="posted-jobs-grid">
            {(loading ? [] : employerJobs).map(job => (
              <div key={job.id} className="posted-job-card">
                <div className="pjc-header">
                  <div className="pjc-title">{job.title}</div>
                  <span className={`badge badge-${job.status === 'ACTIVE' ? 'green' : 'red'}`}>{job.status}</span>
                </div>
                <div className="pjc-meta">
                  <span>{job.applicants || 0} applicants</span>
                  <span> Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="pjc-meta">
                  <span><b>Requirements:</b> {job.requirements}</span>
                </div>
                <div className="pjc-actions">
                  <Link to={`/jobs/${job.id}`}>
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => setEditingJob(job)} disabled={actionBusy}>Edit</Button>
                </div>
              </div>
            ))}
            {loading && <p>Loading jobs...</p>}
            {!loading && employerJobs.length === 0 && <p>No jobs posted yet.</p>}
          </div>
        </section>

        {/* Recent applicants table */}
        <section className="dash-section">
          <div className="section-header">
            <h2>Recent Applicants</h2>
          </div>
          <div className="applications-table-wrap">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Role Applied</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map(app => (
                 <tr key={app.id}>
                    <td>{app.seekerProfile?.name}</td>
                    <td>{app.jobTitle}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${app.status === 'SHORTLISTED' ? 'badge-green' : 'badge-blue'}`}>
                            {app.status}
                          </span>
                        </td>
                      <td>
                          <Link to={`/applicant/${app.id}`}>
                            <Button size="sm" variant="ghost">Review</Button>
                          </Link>
                      </td>
                </tr>
              ))} 

              </tbody>
            </table>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}