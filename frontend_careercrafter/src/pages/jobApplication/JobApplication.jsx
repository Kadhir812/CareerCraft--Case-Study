import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useProfile } from '../../contexts/ProfileContext'
import { getJobByIdApi } from '../../api/jobsApi'
import { applyToJob } from '../../api/applicationApi'
import { getResumesApi } from '../../api/resumeApi'

import './JobApplication.css'

const EXPERIENCE_LEVELS = [
  { value: 'FRESHER', label: 'Fresher (0–1 yr)' },
  { value: 'JUNIOR', label: 'Junior (1–3 yrs)' },
  { value: 'MID_LEVEL', label: 'Mid-level (3–5 yrs)' },
  { value: 'SENIOR', label: 'Senior (5+ yrs)' }
]

const centerStyle = {
  textAlign: 'center',
  padding: '100px 0'
}

export default function JobApplication() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { profile } = useProfile()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [resumes, setResumes] = useState([])
    const [resumesLoading, setResumesLoading] = useState(true)

    const isParsed =
        localStorage.getItem('resumeParsed') === 'true'

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        experienceLevel: isParsed
        ? 'MID_LEVEL'
        : '',
        portfolioUrl: '',
        resumeId: null,
        appliedDate: new Date()
        .toISOString()
        .slice(0, 10)
    })

    const [selectedResume, setSelectedResume] =
        useState(null)

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] =
        useState(false)

    useEffect(() => {
        async function fetchJob() {
        try {
            setLoading(true)

            const data = await getJobByIdApi(id)

            setJob(data)
            setError('')
        } catch (err) {
            setError(
            err?.response?.data?.message ||
                'Job not found'
            )
        } finally {
            setLoading(false)
        }
        }

        fetchJob()
    }, [id])

    useEffect(() => {
        if (profile) {
            setForm(f => ({
            ...f,
            fullName:
                `${profile.firstName || ''} ${
                profile.lastName || ''
                }`.trim(),
            email: profile.email || '',
            phone: profile.phone || ''
            }))
        }
    }, [profile])

    useEffect(() => {
        async function fetchResumes() {
        try {
            setResumesLoading(true)

            const { data } =
            await getResumesApi()

            const list = Array.isArray(data)
            ? data
            : []

            setResumes(list)

            const defaultResume = list.find(
            r => r.isDefault
            )

            if (defaultResume) {
            setSelectedResume(defaultResume.id)

            setForm(f => ({
                ...f,
                resumeId: defaultResume.id
            }))
            }
        } catch (err) {
            console.error(
            'Failed to load resumes',
            err
            )
        } finally {
            setResumesLoading(false)
        }
        }

        fetchResumes()
    }, [])

    function handleChange(e) {
        const { name, value } = e.target

        setForm(f => ({
        ...f,
        [name]: value
        }))

        setErrors(err => ({
        ...err,
        [name]: ''
        }))
    }

    function handleResumeChange(e) {
        const resumeId = Number(e.target.value)

        setSelectedResume(resumeId)

        setForm(f => ({
        ...f,
        resumeId
        }))
    }

    function validate() {
        const errs = {}

        if (!form.fullName.trim())
        errs.fullName =
            'Full name is required.'

        if (!form.email.trim()) {
        errs.email = 'Email is required.'
        } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            form.email
        )
        ) {
        errs.email =
            'Please enter a valid email.'
        }

        if (!form.phone.trim())
        errs.phone =
            'Phone number is required.'

        if (!form.coverLetter.trim())
        errs.coverLetter =
            'Cover letter is required.'

        if (!form.experienceLevel)
        errs.experienceLevel =
            'Please select your experience level.'

        if (
        form.portfolioUrl.trim() &&
        !/^https?:\/\/.+/.test(
            form.portfolioUrl.trim()
        )
        ) {
        errs.portfolioUrl =
            'Portfolio URL must start with http:// or https://'
        }

        return errs
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const errs = validate()

        if (Object.keys(errs).length) {
        setErrors(errs)
        return
        }

        if (!job) {
        setErrors({
            coverLetter: 'Job not loaded.'
        })

        return
        }

        const payload = {
        jobId: job.id,
        coverLetter: form.coverLetter,
        experienceLevel:
            form.experienceLevel,
        portfolioUrl:
            form.portfolioUrl.trim() ||
            null,
        resumeId: form.resumeId || null
        }

        try {
        const token =
            localStorage.getItem('token')

        await applyToJob(payload, token)

        setSubmitted(true)
        } catch (err) {
        setErrors({
            coverLetter:
            err?.response?.data?.message ||
            'Failed to submit application.'
        })
        }
    }

    if (loading) {
        return (
        <div className="page-wrapper">
            <Navbar role="seeker" />

            <main
            className="main-content"
            style={centerStyle}
            >
            <h2>Loading job...</h2>
            </main>

            <Footer />
        </div>
        )
    }

    if (error || !job) {
        return (
        <div className="page-wrapper">
            <Navbar role="seeker" />

            <main
            className="main-content"
            style={centerStyle}
            >
            <h2>Job Not Found</h2>

            <p>
                {error ||
                "The job you're looking for might have been removed."}
            </p>

            <Button
                onClick={() =>
                navigate('/jobs')
                }
                style={{ marginTop: 20 }}
            >
                Back to Search
            </Button>
            </main>

            <Footer />
        </div>
        )
    }

    if (submitted) {
        return (
        <div className="page-wrapper">
            <Navbar role="seeker" />

            <main className="main-content">
            <div className="success-card">
                <div className="success-icon">
                🎉
                </div>

                <h2>
                Application Submitted!
                </h2>

                <p>
                Your application for{' '}
                <strong>{job.title}</strong> at{' '}
                <strong>
                    {job.company}
                </strong>{' '}
                has been received.
                </p>

                <div className="success-actions">
                <Link to="/jobs">
                    <Button variant="secondary">
                    Browse More Jobs
                    </Button>
                </Link>

                <Link to="/dashboard/seeker">
                    <Button>
                    Go to Dashboard
                    </Button>
                </Link>
                </div>
            </div>
            </main>

            <Footer />
        </div>
        )
    }

    return (
        <div className="page-wrapper">
        <Navbar role="seeker" />

        <main className="main-content">
            <div className="apply-layout">
            <aside className="apply-sidebar">
                <div className="apply-job-card">
                <div className="ajc-avatar">
                    {job.company.charAt(0)}
                </div>

                <h3>{job.title}</h3>

                <div className="ajc-company">
                    {job.company}
                </div>

                <div className="ajc-detail">
                    📍 {job.location}
                </div>

                <div className="ajc-detail">
                    💼 {job.type}
                </div>

                <div className="ajc-detail">
                    💰 {job.salary}
                </div>

                <div className="ajc-divider" />

                <h4>About the Role</h4>

                <p className="ajc-desc">
                    {job.description}
                </p>

                <div
                    className="jc-tags"
                    style={{ marginTop: 12 }}
                >
                    {job.tags.map(tag => (
                    <span
                        key={tag}
                        className="jc-tag"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
                </div>
            </aside>

            <div className="apply-form-wrap">
                <div className="apply-form-header">
                <h1>
                    Apply for {job.title}
                </h1>

                <p>
                    Fill in the details below
                    and we'll pass your
                    application along.
                </p>
                </div>

                {isParsed && (
                <div
                    style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 24,
                    fontSize: '0.95rem',
                    border:
                        '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                    }}
                >
                    <span
                    style={{
                        fontSize: '1.2rem'
                    }}
                    >
                    ✨
                    </span>

                    <strong>
                    Resume Parsed:
                    </strong>

                    Your basic details have
                    been auto-filled from
                    your profile!
                </div>
                )}

                <form
                onSubmit={handleSubmit}
                noValidate
                className="apply-form"
                >
                <div className="form-row">
                    <Input
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Ravi Kumar"
                    error={errors.fullName}
                    required
                    />

                    <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ravi@example.com"
                    error={errors.email}
                    required
                    />
                </div>

                <div className="form-row">
                    <Input
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    error={errors.phone}
                    required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">
                    Experience Level
                    <span className="input-required">
                        {' '}
                        *
                    </span>
                    </label>

                    <select
                    name="experienceLevel"
                    className={`filter-select full-select${
                        errors.experienceLevel
                        ? ' select-error'
                        : ''
                    }`}
                    value={
                        form.experienceLevel
                    }
                    onChange={handleChange}
                    >
                    <option value="">
                        Select experience
                        level
                    </option>

                    {EXPERIENCE_LEVELS.map(
                        ({
                        value,
                        label
                        }) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>
                        )
                    )}
                    </select>

                    {errors.experienceLevel && (
                    <span className="input-error">
                        {
                        errors.experienceLevel
                        }
                    </span>
                    )}
                </div>

                <Input
                    label="Portfolio / Website URL"
                    name="portfolioUrl"
                    value={form.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://myportfolio.com"
                    error={errors.portfolioUrl}
                />

                <div className="input-group">
                    <label className="input-label">
                    Cover Letter
                    <span className="input-required">
                        {' '}
                        *
                    </span>
                    </label>

                    <textarea
                    name="coverLetter"
                    className={`textarea-field${
                        errors.coverLetter
                        ? ' textarea-error'
                        : ''
                    }`}
                    rows={6}
                    placeholder="Tell us why you're a great fit for this role…"
                    value={form.coverLetter}
                    onChange={handleChange}
                    />

                    {errors.coverLetter && (
                    <span className="input-error">
                        {errors.coverLetter}
                    </span>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">
                    Select Resume
                    </label>

                    {resumesLoading ? (
                    <p
                        style={{
                        fontSize:
                            '0.9rem',
                        color: '#888'
                        }}
                    >
                        Loading resumes...
                    </p>
                    ) : resumes.length ===
                    0 ? (
                    <p
                        style={{
                        fontSize:
                            '0.9rem',
                        color: '#e11d48'
                        }}
                    >
                        No resumes found.
                        Please upload one
                        in your{' '}
                        <a href="/profile">
                        profile
                        </a>{' '}
                        first.
                    </p>
                    ) : (
                    <select
                        name="resumeId"
                        className="filter-select full-select"
                        value={
                        selectedResume ??
                        ''
                        }
                        onChange={
                        handleResumeChange
                        }
                    >
                        <option value="">
                        -- Select a resume
                        --
                        </option>

                        {resumes.map(r => (
                        <option
                            key={r.id}
                            value={r.id}
                        >
                            {r.fileName} (
                            {r.fileType}
                            {r.isDefault
                            ? ', Default'
                            : ''}
                            )
                        </option>
                        ))}
                    </select>
                    )}
                </div>

                <div className="apply-form-actions">
                    <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        navigate(-1)
                    }
                    >
                    Cancel
                    </Button>

                    <Button
                    type="submit"
                    size="lg"
                    >
                    Submit Application
                    </Button>
                </div>
                </form>
            </div>
            </div>
        </main>

        <Footer />
        </div>
  )
}