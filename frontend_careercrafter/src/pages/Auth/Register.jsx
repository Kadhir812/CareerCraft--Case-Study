import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import ParticleBackground from '../../components/ParticleBackground'
import { registerApi } from '../../api/authApi'
import './AuthPage.css'

const validateEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateWebsite = url =>
  !url || /^https?:\/\/.+/i.test(url)

const getStrength = pw => {
  let score = 0

  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  return score
}

const strengthMeta = ['', 'weak', 'fair', 'good', 'strong']
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong!']

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker',
    companyName: '',
    companyWebsite: ''
  })

  const [errors, setErrors] = useState({})
  const strength = getStrength(form.password)

  function handleChange(e) {
    const { name, value } = e.target

    setForm(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  function validate() {
    const errs = {}

    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.'
    if (form.role === 'employer' && !form.companyName.trim()) errs.companyName = 'Company name is required for employer signup.'

    if (
      form.role === 'employer' &&
      form.companyWebsite.trim() &&
      !validateWebsite(form.companyWebsite.trim())
    ) {
      errs.companyWebsite =
        'Company website must start with http:// or https://'
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!validateEmail(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }

    if (!form.password) {
      errs.password = 'Password is required.'
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.'
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

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        role: form.role === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER',
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName:
          form.role === 'employer'
            ? form.companyName.trim()
            : null,
        companyWebsite:
          form.role === 'employer' &&
          form.companyWebsite.trim()
            ? form.companyWebsite.trim()
            : null
      }

      const { data } = await registerApi(payload)

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      navigate(
        data.role === 'EMPLOYER'
          ? '/company-profile'
          : '/dashboard/seeker'
      )
    } catch (err) {
      setErrors({
        email:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Registration failed'
      })
    }
  }

  return (
    <div className="auth-page">
      <ParticleBackground />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">CareerCrafter</div>

          <h1>Create account</h1>
          <p>Join thousands of professionals today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="role-toggle">
            {['seeker', 'employer'].map(role => (
              <button
                key={role}
                type="button"
                className={`role-btn${
                  form.role === role ? ' active' : ''
                }`}
                onClick={() =>
                  setForm(f => ({ ...f, role }))
                }
              >
                {role === 'seeker'
                  ? 'Job Seeker'
                  : 'Employer'}
              </button>
            ))}
          </div>

          <div className="form-fields">
            <div className="name-row">
              <Input
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Ravi"
                error={errors.firstName}
                required
              />

              <Input
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Kumar"
                error={errors.lastName}
                required
              />
            </div>

            {form.role === 'employer' && (
              <>
                <Input
                  label="Company name"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Techwave Solutions"
                  error={errors.companyName}
                  required
                />

                <Input
                  label="Company website"
                  name="companyWebsite"
                  value={form.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://techwave.example"
                  error={errors.companyWebsite}
                  autoComplete="url"
                />
              </>
            )}

            <Input
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={errors.password}
                required
                autoComplete="new-password"
              />

              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`strength-segment${
                          i <= strength
                            ? ` filled-${strengthMeta[strength]}`
                            : ''
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className={`strength-label ${strengthMeta[strength]}`}
                  >
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" fullWidth size="lg">
            Create Account
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}