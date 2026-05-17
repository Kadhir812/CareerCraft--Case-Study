import { useEffect, useState } from 'react'
import {
  Link,
  useSearchParams
} from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Button from '../../components/Button'


import { searchJobsApi } from '../../api/jobsApi'

import './JobSearch.css'

const locations = [
  'All Locations',
  'Bangalore',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Delhi',
  'Remote'
]

const roles = [
  'All Roles',
  'Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'UI/UX Designer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager'
]

const typeMap = {
  All: '',
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACT',
}

const jobTypes = [
  'All',
  'Full-time',
  'Part-time',
  'Contract'
]

export default function JobSearch() {

  // 1.Initially jobs empty,loading is true
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()


  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [role, setRole] = useState('All Roles')
  const [type, setType] = useState('All')

  
  const [error, setError] = useState('')

  const from = searchParams.get('from')

  const storedRole =
    (
      localStorage.getItem('role') || ''
    ).toUpperCase()

  const isEmployer =
    from === 'employer' ||
    (
      from !== 'seeker' &&
      storedRole === 'EMPLOYER'
    )

  const currentRole =
    isEmployer
      ? 'employer'
      : 'seeker'


      //2.whenever the search is happening page loads 
  useEffect(() => {

    async function loadJobs() {

      //build search query
      try {
        setLoading(true)
        const apiQuery = [
          search,
          role === 'All Roles'
            ? ''
            : role
        ]
          .filter(Boolean)
          .join(' ')

          //call api function
        const response =
          await searchJobsApi({
            query: apiQuery,
            location:
              location ===
              'All Locations'
                ? ''
                : location,
            type: typeMap[type],
            page: 0,
            size: 50,
          })

        setJobs(response.content || [])

        setError('')

      } catch (err) {
        setError(
          err?.response?.data?.message ||
          'Failed to load jobs'
        )
      } finally {
        setLoading(false)
      }
    }

    loadJobs()

  }, [search, location, role, type])


  //3.when user searches,state updates either it is job name,location,role,type.
  // once again above use effect runs (i.e loads the page and fetch).
  //4.after loadjobs() will be executed
  function handleSearchChange(e) {
    setSearch(e.target.value)
  }

  function handleLocationChange(e) {
    setLocation(e.target.value)
  }

  function handleRoleChange(e) {
    setRole(e.target.value)
  }

  const resultCount =
    jobs.length

  return (

    <div className="page-wrapper">

      <Navbar role={currentRole} />
      <main className="main-content">
        <div className="js-header">
          <h1>
            Find Your Next Role
          </h1>

          <p>
            {resultCount}
            {' '}
            opportunities available right now
          </p>

        </div>

        {error && (

          <p
            style={{
              color: '#b42318',
              marginBottom: '12px'
            }}
          >
            {error}
          </p>

        )}

        <div className="search-bar-card">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>

            <input
              className="search-input"
              type="text"
              placeholder="Search job title or company…"
              value={search}
              onChange={handleSearchChange}
            />

          </div>

          <select
            className="filter-select"
            value={location}
            onChange={handleLocationChange}
          >

            {locations.map(location => (
              <option key={location}>{location}</option>
            ))}

          </select>

          <select
            className="filter-select"
            value={role}
            onChange={handleRoleChange}
          >

            {roles.map(role => (

              <option
                key={role}
              >
                {role}
              </option>

            ))}

          </select>

        </div>

        <div className="type-pills">

          {jobTypes.map(jobType => (

            <button
              key={jobType}
              className={`type-pill${
                type === jobType
                  ? ' active'
                  : ''
              }`}
              onClick={() =>
                setType(jobType)
              }
            >
              {jobType}
            </button>

          ))}

          <span className="results-count">

            {resultCount}
            {' '}
            result
            {resultCount !== 1
              ? 's'
              : ''}

          </span>

        </div>

        {loading ? (

          <div className="no-results">

            <h3>
              Loading jobs...
            </h3>

          </div>

        ) : jobs.length === 0 ? (

          <div className="no-results">

            <div className="no-results-icon">
              🔎
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try adjusting your search
              or filters.
            </p>

          </div>

        ) : (

          <div className="jobs-grid">

            {jobs.map(job => {

              const badgeClass =
                job.type === 'Full-time'
                  ? 'badge-blue'
                  : job.type ===
                    'Part-time'
                    ? 'badge-orange'
                    : 'badge-gray'

              return (

                <div
                  key={job.id}
                  className="job-card"
                >

                  <div className="jc-top">

                    <div className="jc-avatar">
                      {job.company.charAt(0)}
                    </div>

                    <div className="jc-meta-top">

                      <span className="jc-posted">
                        {job.posted}
                      </span>

                      <span
                        className={`badge ${badgeClass}`}
                      >
                        {job.type}
                      </span>

                    </div>

                  </div>

                  <h3 className="jc-title">
                    {job.title}
                  </h3>

                  <div className="jc-company">
                    {job.company}
                  </div>

                  <div className="jc-location">
                    📍 {job.location}
                  </div>

                  <p className="jc-desc">

                    {job.description.slice(
                      0,
                      110
                    )}
                    …

                  </p>

                  <div className="jc-tags">

                    {job.tags.map(tag => (

                      <span
                        key={tag}
                        className="jc-tag"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                  <div className="jc-footer">

                    <span className="jc-salary">
                      {job.salary}
                    </span>

                    <Link
                      to={`/jobs/${job.id}?from=${currentRole}`}
                    >

                      <Button size="sm">
                        View Details
                      </Button>

                    </Link>

                  </div>

                </div>

              )
            })}

          </div>

        )}

      </main>

      <Footer />

    </div>
  )
}