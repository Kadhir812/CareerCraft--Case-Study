# ProfileContext API Usage Guide

## Overview
ProfileContext is a React Context API implementation that manages global user profile state across the entire application. It fetches the profile once at app startup and makes it available to all components without prop drilling.

---

## Context Definition

**File:** `src/contexts/ProfileContext.jsx`

### Created By:
- `ProfileProvider` component — wraps the app, fetches profile once, provides context
- `useProfile()` hook — custom hook to access context in any component

### Provides:
```js
{
  profile,        // User profile data object (firstName, lastName, email, phone, role, etc.)
  setProfile,     // Function to manually update profile state
  loading,        // Boolean indicating if profile is being fetched
  error,          // Error message if fetch fails
  reload,         // Async function to manually reload profile from API
  role,           // Derived from profile or localStorage (employer | job_seeker)
  email           // Derived from profile or localStorage
}
```

---

## Where Context is Provided

**File:** `src/App.jsx`

The app is wrapped with `<ProfileProvider>` at the top level:
```jsx
import { ProfileProvider } from "./contexts/ProfileContext"

function App() {
  return (
    <ProfileProvider>
      <Routes>
        {/* All routes have access to ProfileContext */}
      </Routes>
    </ProfileProvider>
  )
}
```

---

## Where Context is Consumed

### 1. Job Application Page
**File:** `src/pages/jobApplication/JobApplication.jsx`

**What it uses:**
```jsx
const { profile } = useProfile()
```

**Purpose:**
- Auto-fills form fields (fullName, email, phone) when user applies for a job
- Removes redundant API call (previously `getMyProfileApi()`)
- Form updates whenever profile context changes

**Usage:**
```jsx
useEffect(() => {
  if (profile) {
    setForm(f => ({
      ...f,
      fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      email: profile.email || '',
      phone: profile.phone || ''
    }))
  }
}, [profile])
```

**Benefit:** Eliminates duplicate API call, instant data availability

---

### 2. Job Seeker Dashboard
**File:** `src/pages/dashboards/JobSeekerDashboard.jsx`

**What it uses:**
```jsx
const { profile } = useProfile()
```

**Purpose:**
- Displays user greeting with full name
- Fallback to email username if name not available
- Replaces previous `getMyProfileApi()` call

**Usage:**
```jsx
const fullName = useMemo(() => {
  if (profile?.firstName || profile?.lastName) {
    return [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
  }
  return ''
}, [profile])

const greetingName = useMemo(() => {
  if (fullName) return fullName
  const email = profile?.email || localStorage.getItem('email') || ''
  return email.split('@')[0] || 'there'
}, [fullName, profile?.email])
```

**Benefit:** No API call on page load, profile already cached

---

### 3. Job Seeker Profile Page
**File:** `src/pages/profile/JobSeeker/JobSeekerProfile.jsx`

**What it uses:**
```jsx
const { profile: contextProfile, role: contextRole, reload } = useProfile()
```

**Purpose:**
- Loads user profile data from context (instead of API)
- Extracts role for page logic
- Uses `reload()` function after profile updates to sync context

**Usage:**
```jsx
// Get profile from context
const { profile: contextProfile, role: contextRole, reload } = useProfile()
const initialRole = contextRole === 'employer' ? 'employer' : 'seeker'

// Load profile data into form
useEffect(() => {
  loadSeekerProfile()
}, [contextProfile])

// After saving profile, reload context
async function handleSave() {
  try {
    // ... update profile API call ...
    setIsEditing(false)
    await reload()  // Refresh context for all consumers
  } catch (err) {
    setResumeError(err?.response?.data?.message || 'Failed to save profile')
  }
}
```

**Benefit:** 
- Centralized profile loading
- All consumers (Navbar, Dashboard, JobApplication) sync when profile updates
- Single source of truth

---

### 4. Navigation Bar
**File:** `src/components/Navbar.jsx`

**What it uses:**
```jsx
const { role: contextRole } = useProfile()
const role = contextRole === 'employer' ? 'employer' : 'seeker'
```

**Purpose:**
- Dynamically renders seeker vs employer navigation links based on role
- Replaces prop drilling (previously received `role` as prop)
- Role derived from context with localStorage fallback

**Usage:**
```jsx
const seekerLinks = [
  { to: '/dashboard/seeker', label: 'Dashboard' },
  { to: '/jobs?from=seeker', label: 'Find Jobs' },
  { to: '/profile', label: 'Profile' },
]

const employerLinks = [
  { to: '/dashboard/employer', label: 'Dashboard' },
  { to: '/jobs?from=employer', label: 'Browse Jobs' },
  { to: '/company-profile', label: 'Company Profile' },
]

const links = role === 'employer' ? employerLinks : seekerLinks
```

**Benefit:**
- No prop drilling, cleaner component API
- Automatically updates when role changes

---

## Architecture Diagram

```
App.jsx
  └── <ProfileProvider>
        ├── Fetches profile once
        ├── Stores: profile, loading, error, role, email
        │
        └── <Routes>
              ├── <JobApplication />
              │     └── const { profile } = useProfile()
              │
              ├── <JobSeekerDashboard />
              │     └── const { profile } = useProfile()
              │
              ├── <JobSeekerProfile />
              │     └── const { profile, role, reload } = useProfile()
              │
              └── <Navbar />
                    └── const { role } = useProfile()
```

---

## Data Flow

### On App Load:
1. `ProfileProvider` mounts
2. Automatically calls `getMyProfileApi()` once
3. Stores result in context state
4. All wrapped components can access via `useProfile()`

### On Profile Update (from JobSeekerProfile):
1. User updates profile via `updateMyProfileApi()`
2. Component calls `reload()` from context
3. `reload()` refetches profile via API
4. Context state updates
5. All consumers re-render with new data (JobApplication, Dashboard, Navbar, etc.)

---

## Benefits Summary

| Benefit | Reason |
|---------|--------|
| **Single API Call** | Profile loaded once at startup, not on every page |
| **No Prop Drilling** | Pass context to any nested component without props |
| **Synchronized State** | Updates in one page sync across entire app |
| **Cleaner Code** | Remove repetitive `useEffect + useState + API` patterns |
| **Better Performance** | Reduced redundant API calls |
| **Persistent on Refresh** | ProfileProvider refetches automatically |
| **Fallback Support** | Uses localStorage if context unavailable |

---

## Future Enhancements

Potential pages/components to add ProfileContext integration:

1. **CompanyProfile** — Create separate `EmployerProfileContext`
2. **JobSearch** — Use `role` from context instead of localStorage
3. **JobDetails** — Use `role` from context for employer/seeker logic
4. **EmployerDashboard** — Load employer profile from context

---

## Files Modified/Created

### New Files:
- `src/contexts/ProfileContext.jsx` — Context provider & hook

### Modified Files:
- `src/App.jsx` — Wrapped with ProfileProvider
- `src/pages/jobApplication/JobApplication.jsx` — Uses useProfile()
- `src/pages/dashboards/JobSeekerDashboard.jsx` — Uses useProfile()
- `src/pages/profile/JobSeeker/JobSeekerProfile.jsx` — Uses useProfile() + reload()
- `src/components/Navbar.jsx` — Uses useProfile() for role
