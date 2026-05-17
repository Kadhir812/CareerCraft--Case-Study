import { useState } from 'react'

import Button from '../../components/Button'
import Input from '../../components/Input'
import './JobPost.css'

const defaultForm = {
    title: '',
    description: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    deadline: '',
    requirements: '',
    status: 'ACTIVE',
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
}

export default function JobPost({
  onSubmit,
  onCancel,
  initialJob
}) {

  const [form, setForm] = useState(
    initialJob
        ? {
            ...initialJob,
            deadline: initialJob.deadline
                ? String(initialJob.deadline).slice(0, 10)
                : '',
            salaryMin:
                initialJob.salaryMin ?? '',
            salaryMax:
                initialJob.salaryMax ?? '',
            status:
                initialJob.status || 'ACTIVE',
            }
        : defaultForm
    )

    const [errors, setErrors] = useState({})

    function handleChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  function validate() {

    const errs = {}

    const {
        title,
        description,
        location,
        jobType,
        deadline,
        salaryMin,
        salaryMax,
        requirements,
        status
    } = form

    if (!title.trim())
      errs.title = 'Title is required.'

    if (!description.trim())
      errs.description =
        'Description is required.'

    if (!location.trim())
      errs.location =
        'Location is required.'

    if (!jobType)
      errs.jobType =
        'Job Type is required.'

    if (!deadline)
      errs.deadline =
        'Deadline is required.'

    const salaryMinStr = String(salaryMin || '').trim()
    const salaryMaxStr = String(salaryMax || '').trim()

    if (!salaryMinStr)
      errs.salaryMin = 'Required.'

    if (!salaryMaxStr)
      errs.salaryMax = 'Required.'

    if (salaryMinStr && Number(salaryMinStr) < 0)
      errs.salaryMin = 'Must be >= 0.'

    if (salaryMaxStr && Number(salaryMaxStr) < 0)
      errs.salaryMax = 'Must be >= 0.'

    if (
      Number(salaryMin) >
      Number(salaryMax)
    ) {
      errs.salaryMax =
        'Must be > Min.'
    }

    if (!requirements?.trim()) {
      errs.requirements =
        'Requirements are required.'
    }

    if (!status)
      errs.status =
        'Status is required.'

    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSubmit(form)
  }

  return (
    <div className="jobpost-modal">

      <form
        className="jobpost-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {initialJob
            ? 'Edit Job'
            : 'Post a New Job'}
        </h2>

        <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            required
        />

        <div style={gridStyle}>
            <div className="input-group">
                <label className="input-label">
                Job Type
                <span className="input-required">
                    *
                </span>
                </label>

                <select
                name="jobType"
                className={`filter-select full-select${
                    errors.jobType
                    ? ' select-error'
                    : ''
                }`}
                value={form.jobType}
                onChange={handleChange}
                >

                <option value="">
                    Select Type
                </option>

                <option value="FULL_TIME">
                    Full-Time
                </option>

                <option value="PART_TIME">
                    Part-Time
                </option>

                <option value="CONTRACT">
                    Contract
                </option>

                <option value="INTERNSHIP">
                    Internship
                </option>

                <option value="REMOTE">
                    Remote
                </option>

            </select>

                {errors.jobType && (
                <span className="input-error">
                    {errors.jobType}
                </span>
                )}

        </div>

        <Input
            label="Application Deadline"
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            error={errors.deadline}
            required
        />

        </div>

        <div style={gridStyle}>

        <Input
            label="Minimum Salary (₹)"
            type="number"
            name="salaryMin"
            value={form.salaryMin}
            onChange={handleChange}
            error={errors.salaryMin}
            required
        />

        <Input
            label="Maximum Salary (₹)"
            type="number"
            name="salaryMax"
            value={form.salaryMax}
            onChange={handleChange}
            error={errors.salaryMax}
            required
        />
        </div>

        <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            error={errors.location}
            required
        />

        <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
            required
            multiline
        />

        <Input
            label="Requirements (separate by commas)"
            name="requirements"
            value={form.requirements || ''}
            onChange={handleChange}
            error={errors.requirements}
            required
            multiline
        />

        <div className="input-group">

            <label className="input-label">
                Job Status
                <span className="input-required">
                *
                </span>
            </label>

            <select
                name="status"
                className={`filter-select full-select${
                errors.status
                    ? ' select-error'
                    : ''
                }`}
                value={form.status}
                onChange={handleChange}
            >

                <option value="ACTIVE">
                Active
                </option>

                <option value="CLOSED">
                Closed
                </option>

            </select>

            {errors.status && (
                <span className="input-error">
                {errors.status}
                </span>
            )}

        </div>

        <div className="jobpost-actions">

            <Button type="submit" size="md">
                {initialJob
                ? 'Save Changes'
                : 'Post Job'}
            </Button>

            <Button
                type="button"
                size="md"
                variant="ghost"
                onClick={onCancel}
            >
            Cancel
            </Button>

        </div>

    </form>

    </div>
  )
}