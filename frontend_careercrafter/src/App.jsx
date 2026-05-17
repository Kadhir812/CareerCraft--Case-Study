import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import JobSeekerDashboard from "./pages/dashboards/JobSeekerDashboard"
import EmployerDashboard from "./pages/dashboards/EmployerDashboard"
import JobSeekerProfile from "./pages/profile/JobSeeker/JobSeekerProfile"
import CompanyProfile from "./pages/profile/employer/CompanyProfile"
import JobSearch from "./pages/job/JobSearch"
import JobDetails from "./pages/job/JobDetails"
import { ProfileProvider } from "./contexts/ProfileContext"
import JobApplication from "./pages/jobApplication/JobApplication"


function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/seeker" element={<JobSeekerDashboard/>} />
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        <Route path="/profile" element={<JobSeekerProfile />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetails/>} />
        <Route path="/jobs/apply/:id" element={<JobApplication />} />
      </Routes>
    </ProfileProvider>
  )
}

export default App
