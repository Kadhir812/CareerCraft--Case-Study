import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'

import { getCandidateProfileApi } from '../../api/profileApi'

import './ApplicantProfile.css'
import '../profile/ResumeBuilder.css'

const formatRange = (startDate, endDate) => {
  if (!startDate && !endDate) return 'Dates not provided'
  return `${startDate || 'N/A'} - ${endDate || 'Present'}`
}

export default function JobSeekerProfileView() {
  const { id } = useParams()
  const { state } = useLocation()

  const [candidate, setCandidate] = useState(
    state?.profile ? { profile: state.profile } : null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        setLoading(true)

        const { data } = await getCandidateProfileApi(id)

        setCandidate(data)
        setError('')
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            'Failed to load candidate profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCandidate()
  }, [id])

  const renderPage = content => (
    <div className="page-wrapper">
      <Navbar role="employer" />
      <main className="main-content">{content}</main>
      <Footer />
    </div>
  )

  if (loading && !candidate) {
    return renderPage(<p>Loading candidate profile...</p>)
  }

  if (!candidate && !loading) {
    return renderPage(
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Candidate Profile Not Found</h2>

        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          {error || 'This candidate profile could not be loaded.'}
        </p>

        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const {
    profile = {},
    defaultResume,
    skills = [],
    workExperience = [],
    education = []
  } = candidate

  const {
    name = 'Candidate Profile',
    phone = 'Phone not available',
    location = 'Location not available',
    headline = '',
    email = 'Email not available'
  } = profile

  const backToApplicantProfile = state?.applicationId
    ? `/applicant/${state.applicationId}`
    : '/dashboard/employer'

  return renderPage(
    <>
      <div style={{ marginBottom: '24px' }}>
        <Link
          to={backToApplicantProfile}
          style={{ color: 'var(--text-muted)' }}
        >
          &larr; Back to Applicant Profile
        </Link>
      </div>

      <div className="applicant-profile-container">
        <aside className="applicant-sidebar">
          <div className="applicant-card" style={{ padding: '40px 24px' }}>
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
                  marginBottom: 0
                }}
              >
                {headline}
              </p>
            )}

            {loading && (
              <p className="profile-load-note">
                Loading full profile...
              </p>
            )}

            {!loading && error && (
              <p className="applicant-error">{error}</p>
            )}

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
              <label>Resume</label>

              {defaultResume?.fileUrl ? (
                <a
                  href={defaultResume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="view-profile-link"
                >
                  {defaultResume.fileName || 'Open resume'}
                </a>
              ) : (
                <p>No default resume available.</p>
              )}
            </div>
          </div>
        </aside>

        <div className="applicant-main">
          <div className="applicant-card">
            <div className="section-header">
              <h2>Skills</h2>
            </div>

            {skills.length ? (
              <div className="skills-container">
                {skills.map(skill => (
                  <div key={skill.id} className="skill-tag">
                    {skill.skillName}
                  </div>
                ))}
              </div>
            ) : (
              <p>No skills added yet.</p>
            )}
          </div>

          <div className="applicant-card">
            <div className="section-header">
              <h2>Work Experience</h2>
            </div>

            {workExperience.length ? (
              workExperience.map(exp => (
                <div key={exp.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-title">
                      {exp.position || 'Position not provided'}
                    </div>
                  </div>

                  <div className="entry-subtitle">
                    {exp.company || 'Company not provided'}
                  </div>

                  <div className="entry-duration">
                    {formatRange(exp.startDate, exp.endDate)}
                  </div>

                  {exp.location && (
                    <div className="entry-duration">
                      {exp.location}
                    </div>
                  )}

                  <div className="entry-desc">
                    {exp.description || 'No description provided.'}
                  </div>
                </div>
              ))
            ) : (
              <p>No work experience added yet.</p>
            )}
          </div>

          <div className="applicant-card">
            <div className="section-header">
              <h2>Education</h2>
            </div>

            {education.length ? (
              education.map(edu => (
                <div key={edu.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-title">
                      {edu.degree || 'Degree not provided'}
                    </div>
                  </div>

                  <div className="entry-subtitle">
                    {edu.institution || 'Institution not provided'}
                  </div>

                  <div className="entry-duration">
                    {[edu.fieldOfStudy, edu.graduationDate]
                      .filter(Boolean)
                      .join(' | ') ||
                      'Education details not provided'}
                  </div>

                  {edu.grade && (
                    <div className="entry-duration">
                      Grade: {edu.grade}
                    </div>
                  )}

                  <div className="entry-desc">
                    {edu.description || 'No description provided.'}
                  </div>
                </div>
              ))
            ) : (
              <p>No education added yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}