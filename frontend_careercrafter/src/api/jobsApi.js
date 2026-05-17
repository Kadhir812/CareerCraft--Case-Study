import api from './client'

const TYPE_LABELS = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
}

function toDateOnly(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function toUiJob(job) {
  const salaryMin = Number(job.salaryMin || 0)
  const salaryMax = Number(job.salaryMax || 0)

  return {
    id: job.jobId,
    jobId: job.jobId,
    employerId: job.employerId,
    company: job.companyName || 'Employer',
    title: job.title || '',
    description: job.description || '',
    requirements: job.requirements || '',
    tags: (job.requirements || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    location: job.location || '',
    jobType: job.jobType,
    type: TYPE_LABELS[job.jobType] || job.jobType,
    salaryMin,
    salaryMax,
    salary: salaryMin || salaryMax ? `INR ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}` : 'Salary not specified',
    postedDate: job.postedDate,
    posted: job.postedDate ? new Date(job.postedDate).toLocaleDateString() : '',
    deadline: toDateOnly(job.deadline),
    status: job.status || 'ACTIVE',
    applicants: 0,
  }
}

function toBackendCreatePayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    requirements: (form.requirements || '').trim(),
    location: form.location.trim(),
    jobType: form.jobType,
    salaryMin: Number(form.salaryMin),
    salaryMax: Number(form.salaryMax),
    deadline: `${form.deadline}T00:00:00Z`,
  }
}

function toBackendUpdatePayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    requirements: (form.requirements || '').trim(),
    location: form.location.trim(),
    jobType: form.jobType,
    salaryMin: Number(form.salaryMin),
    salaryMax: Number(form.salaryMax),
    deadline: `${form.deadline}T00:00:00Z`,
    status: form.status,
  }
}

//search
export async function searchJobsApi({ query, location, type, page = 0, size = 20 }) {
  const params = { page, size }
  if (query?.trim()) params.query = query.trim()
  if (location?.trim()) params.location = location.trim()
  if (type) params.type = type

  const { data } = await api.get('/jobs', { params })
  return {
    ...data,
    content: (data?.content || []).map(toUiJob),
  }
}



export async function getMyJobsApi({ page = 0, size = 100 } = {}) {
  const { data } = await api.get('/jobs/my', { params: { page, size } })
  return {
    ...data,
    content: (data?.content || []).map(toUiJob),
  }
}

export async function getJobByIdApi(jobId) {
  const { data } = await api.get(`/jobs/${jobId}`)
  return toUiJob(data)
}

export async function createJobApi(form) {
  const payload = toBackendCreatePayload(form)
  const { data } = await api.post('/jobs', payload)
  return toUiJob(data)
}

export async function updateJobApi(jobId, form) {
  const payload = toBackendUpdatePayload(form)
  const { data } = await api.put(`/jobs/${jobId}`, payload)
  return toUiJob(data)
}

