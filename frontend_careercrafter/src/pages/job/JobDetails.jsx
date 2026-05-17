import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'

import { getJobByIdApi } from '../../api/jobsApi'

import './JobDetails.css'

export default function JobDetails() {

  //2.extract job id using useParams
  const { id } = useParams()
  const navigate = useNavigate()


  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  //3.get current role
  const currentRole =
    localStorage.getItem('role')?.toUpperCase() === 'EMPLOYER'
      ? 'employer'
      : 'seeker'

  const jobsRoute = `/jobs?from=${currentRole}`

  //5.
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)

        //6.
        const data = await getJobByIdApi(id)

        //7.
        setJob(data)

        setError('')
      } catch (err) {
        setError(err?.response?.data?.message || 'Job not found')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id])//whenever id changes component refreshes

  //8.UI renders
  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar role={currentRole} />

        <main className="main-content job-state">
          <h2>Loading job...</h2>
        </main>

        <Footer />
      </div>
    )
  }

  if (!job || error) {
    return (
      <div className="page-wrapper">
        <Navbar role={currentRole} />

        <main className="main-content job-state">
          <h2>Job Not Found</h2>

          <p>{error || "The job you're looking for might have been removed."}</p>

          <Button
            onClick={() => navigate(jobsRoute)}
            className="back-btn"
          >
            Back to Search
          </Button>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar role={currentRole} />

      <main className="main-content">
        <div className="job-details-container">

          <div className="job-main-column">

            <div className="job-header">

              <div className="job-header-top">

                <div className="job-company-logo">
                  {job.company.charAt(0)}
                </div>

                <div>
                  <h1 className="job-title-large">
                    {job.title}
                  </h1>

                  <span className="job-company-name">
                    {job.company}
                  </span>
                </div>

              </div>

              <div className="job-meta-row">

                <div className="job-meta-item">
                  {job.location}
                </div>

                <div className="job-meta-item">
                  {job.type}
                </div>

                <div className="job-meta-item">
                  {job.salary}
                </div>

                <div className="job-meta-item">
                  Posted {job.posted}
                </div>

              </div>

            </div>

            <div className="job-section">

              <h3>About the Role</h3>

              <p className="job-description-content">
                {job.description}
              </p>

            </div>

            <div className="job-section">

              <h3>Required Skills</h3>

              <div className="skills-wrap">
                {job.tags.map(tag => (
                  <span
                    key={tag}
                    className="badge badge-gray"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>

          </div>

          <aside className="job-sidebar-column">

            <div className="sidebar-card">

              <h4>Job Overview</h4>

              {[
                ['Posted Date', job.posted],
                ['Location', job.location],
                ['Job Type', job.type],
                ['Salary', job.salary],
              ].map(([label, value]) => (
                <div
                  className="sidebar-detail"
                  key={label}
                >
                  <span className="sidebar-label">
                    {label}
                  </span>

                  <span className="sidebar-value">
                    {value}
                  </span>
                </div>
              ))}

              <div className="apply-button-wrap">

                <Link to={`/jobs/apply/${job.id}`}>
                  <Button fullWidth size="lg">
                    Apply Now
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate(jobsRoute)}
                >
                  Back to Search
                </Button>

              </div>

            </div>

            <div className="sidebar-card">

              <h4>About {job.company}</h4>

              <p className="company-description">
                {job.company} is a leading tech firm dedicated to
                building innovative solutions that empower businesses
                worldwide. They value culture, diversity, and rapid growth.
              </p>

              <div className="company-link-wrap">
                <a href="#">
                  View Company Profile →
                </a>
              </div>

            </div>

          </aside>

        </div>
      </main>

      <Footer />
    </div>
  )
}