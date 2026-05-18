import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import ParticleBackground from '../../components/ParticleBackground'
import { loginApi } from '../../api/authApi'
import './AuthPage.css'

const ALLOWED_ROLES = ['EMPLOYER', 'SEEKER']

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const sanitizeToken = (token) => {
  if (typeof token !== 'string') {
    return null
  }

  const normalizedToken = token.trim()

  return normalizedToken.length > 0
    ? normalizedToken
    : null
}

const sanitizeRole = (role) => {
  if (typeof role !== 'string') {
    return null
  }

  return ALLOWED_ROLES.includes(role)
    ? role
    : null
}

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return null
  }

  const normalizedEmail = email.trim()

  return validateEmail(normalizedEmail)
    ? normalizedEmail
    : null
}

const Login = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((f) => ({
      ...f,
      [name]: value
    }))

    setErrors((err) => ({
      ...err,
      [name]: ''
    }))
  }

  const validate = () => {
    const errs = {}

    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!validateEmail(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }

    if (!form.password) {
      errs.password = 'Password is required.'
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
      const { data } = await loginApi(form)

      const token = sanitizeToken(data?.token)
      const role = sanitizeRole(data?.role)
      const email = sanitizeEmail(data?.email)

      if (!token || !role || !email) {
        throw new Error('Invalid server response')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('email', email)

      navigate(
        role === 'EMPLOYER'
          ? '/dashboard/employer'
          : '/dashboard/seeker'
      )
    } catch (err) {
      setErrors({
        password:
          err?.response?.data?.message ||
          err?.message ||
          'Invalid credentials'
      })
    }
  }

  return (
    <div className="auth-page">
      <ParticleBackground />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">CareerCrafter</div>

          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-fields">
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

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="forgot-link">
            <a href="#">Forgot password?</a>
          </div>

          <Button type="submit" fullWidth size="lg">
            Sign In
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login