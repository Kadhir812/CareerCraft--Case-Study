import { useEffect, useState, useRef } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

import { useProfile } from '../../../contexts/ProfileContext'
import { updateMyProfileApi } from '../../../api/profileApi'
import { addSkillApi,addWorkExperienceApi,addEducationApi,getResumesApi,getEducationApi,
          getExperienceApi,getSkillsApi,updateEducationApi, deleteEducationApi,
        updateWorkExperienceApi,deleteWorkExperienceApi,deleteSkillApi,deleteResumeApi,
        uploadResumeApi,setDefaultResumeApi,updateResumeVisibilityApi } from '../../../api/resumeApi'

import '../UserProfile.css'
import '../ResumeBuilder.css'

import SkillsSection from './SkillsSection'
import ResumeSection from './ResumeSection'
import ProfileInfo from './ProfileInfo'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'

const initialExpForm = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  location: '',
  description: ''
}

const initialEduForm = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  grade: '',
  graduationDate: '',
  description: ''
}

  const JobSeekerProfile = () => {
  const { profile: contextProfile, role: contextRole, reload } = useProfile()

  const currentRole = contextRole === 'employer' ? 'employer' : 'seeker'

  const [profile, setProfile] = useState({
    id: null,
    role: currentRole,
    name: '',
    email: contextProfile?.email || localStorage.getItem('email') || '',
    phone: '',
    location: '',
    bio: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
   
  })
  const [isEditing, setIsEditing] = useState(false)

  const [skillsList, setSkillsList] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [skillError, setSkillError] = useState('')
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [skillsLoadError, setSkillsLoadError] = useState('')

  const [experienceList, setExperienceList] = useState([])
  const [expForm, setExpForm] = useState(initialExpForm)
  const [expError, setExpError] = useState('')
  const [showExpForm, setShowExpForm] = useState(false)
  const [editExpId, setEditExpId] = useState(null)

  const [educationList, setEducationList] = useState([])
  const [eduForm, setEduForm] = useState(initialEduForm)
  const [eduError, setEduError] = useState('')
  const [showEduForm, setShowEduForm] = useState(false)
  const [editEduId, setEditEduId] = useState(null)

  const [resumes, setResumes] = useState([])
  const [resumeError, setResumeError] = useState('')
  const [selectedResume, setSelectedResume] = useState(null)

  const resumeInputRef = useRef(null)

  const loadSeekerProfile = async () => {
    if (currentRole !== 'seeker' || !contextProfile) return

    setProfile(prev => ({
      ...prev,
      role: 'seeker',
      name: `${contextProfile.firstName || ''} ${contextProfile.lastName || ''}`.trim(),
      email: contextProfile.email || prev.email,
      phone: contextProfile.phone || '',
      location: contextProfile.location || '',
      bio: contextProfile.headline || ''
    }))
  }

  useEffect(() => {
    loadSeekerProfile()
  }, [contextProfile, currentRole])

  const loadResumeData = async () => {
    try {
      const { data } = await getSkillsApi()
      setSkillsList(Array.isArray(data) ? data : [])
      setSkillsLoadError('')
    } catch {
      setSkillsLoadError('Failed to load skills')
    }

    try {
      const { data } = await getResumesApi()
      setResumes(data || [])
    } catch {}

    try {
      const { data } = await getEducationApi()
      setEducationList(data || [])
    } catch {}

    try {
      const { data } = await getExperienceApi()
      setExperienceList(data || [])
    } catch {}
  }

  useEffect(() => {
    loadResumeData()
  }, [])

  const handleSkillChange = (e) =>
    setSkillInput(e.target.value)

  async function handleAddSkill(e) {
    e.preventDefault()

    setSkillError('')

    const skillName = skillInput.trim()

    if (!skillName) {
      setSkillError('Skill cannot be empty.')
      return
    }

    try {
      await addSkillApi({ skillName })

      const { data } = await getSkillsApi()

      setSkillsList(Array.isArray(data) ? data : [])
      setSkillInput('')
      setShowSkillForm(false)
    } catch (err) {
      setSkillError(
        err?.response?.data?.message || 'Failed to add skill'
      )
    }
  }

  async function handleDeleteSkill(skillId) {
    try {
      await deleteSkillApi(skillId)

      setSkillsList(prev =>
        prev.filter(s => s.id !== skillId)
      )
    } catch (err) {
      console.error(err)
    }
  }

  function handleExpChange(e) {
    const { name, value } = e.target

    setExpForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleAddOrUpdateExperience(e) {
    e.preventDefault()

    setExpError('')

    if (
      !expForm.company ||
      !expForm.position ||
      !expForm.startDate
    ) {
      setExpError(
        'Company, Position, and Start Date are required.'
      )
      return
    }

    try {
      const payload = {
        ...expForm,
        startDate: expForm.startDate || null,
        endDate: expForm.endDate || null
      }

      if (editExpId) {
        const { data } =
          await updateWorkExperienceApi(
            editExpId,
            payload
          )

        setExperienceList(prev =>
          prev.map(exp =>
            exp.id === editExpId
              ? { ...data }
              : exp
          )
        )
      } else {
        const { data } =
          await addWorkExperienceApi(payload)

        setExperienceList(prev => [
          ...prev,
          {
            id: data?.id || Date.now(),
            ...expForm
          }
        ])
      }

      setExpForm(initialExpForm)
      setShowExpForm(false)
      setEditExpId(null)
    } catch (err) {
      setExpError(
        err?.response?.data?.message ||
          'Failed to add/update experience'
      )
    }
  }

  function handleEditExperience(exp) {
    setExpForm({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      location: exp.location || '',
      description: exp.description || ''
    })

    setEditExpId(exp.id)
    setShowExpForm(true)
  }

  async function handleDeleteExperience(id) {
    try {
      await deleteWorkExperienceApi(id)

      setExperienceList(prev =>
        prev.filter(exp => exp.id !== id)
      )

      if (editExpId === id) {
        setEditExpId(null)
        setShowExpForm(false)
      }
    } catch (err) {
      setExpError(
        err?.response?.data?.message ||
          'Failed to delete experience'
      )
    }
  }

  function handleEduChange(e) {
    const { name, value } = e.target

    setEduForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleAddOrUpdateEducation(e) {
    e.preventDefault()

    setEduError('')

    if (
      !eduForm.institution ||
      !eduForm.degree ||
      !eduForm.graduationDate
    ) {
      setEduError(
        'Institution, Degree, and Graduation Date are required.'
      )
      return
    }

    try {
      const payload = {
        ...eduForm,
        graduationDate:
          eduForm.graduationDate || null
      }

      if (editEduId) {
        const { data } =
          await updateEducationApi(
            editEduId,
            payload
          )

        setEducationList(prev =>
          prev.map(edu =>
            edu.id === editEduId
              ? { ...edu, ...data }
              : edu
          )
        )
      } else {
        const { data } =
          await addEducationApi(payload)

        setEducationList(prev => [
          ...prev,
          {
            id: data?.id || Date.now(),
            ...eduForm
          }
        ])
      }

      setEduForm(initialEduForm)
      setShowEduForm(false)
      setEditEduId(null)
    } catch (err) {
      setEduError(
        err?.response?.data?.message ||
          'Failed to add/update education'
      )
    }
  }

  function handleEditEducation(edu) {
    setEduForm({
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      grade: edu.grade || '',
      graduationDate: edu.graduationDate || '',
      description: edu.description || ''
    })

    setEditEduId(edu.id)
    setShowEduForm(true)
  }

  async function handleDeleteEducation(id) {
    try {
      await deleteEducationApi(id)

      setEducationList(prev =>
        prev.filter(edu => edu.id !== id)
      )

      if (editEduId === id) {
        setEditEduId(null)
        setShowEduForm(false)
      }
    } catch (err) {
      setEduError(
        err?.response?.data?.message ||
          'Failed to delete education'
      )
    }
  }

  function handleChange(e) {
    const { name, value } = e.target

    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSave() {
    try {
      if (profile.role === 'seeker') {
        const fullName =
          profile.name.trim().split(/\s+/)

        const firstName = fullName[0] || ''
        const lastName =
          fullName.slice(1).join(' ')

        if (!firstName || !lastName) {
          setResumeError(
            'Please provide full name as first and last name'
          )
          return
        }

        const { data } =
          await updateMyProfileApi({
            firstName,
            lastName,
            phone: profile.phone || null,
            location: profile.location || null,
            headline: profile.bio || null
          })

        setProfile(prev => ({
          ...prev,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || prev.email,
          phone: data.phone || '',
          location: data.location || '',
          bio: data.headline || ''
        }))
      }

      setResumeError('')
      setIsEditing(false)
      await reload()
    } catch (err) {
      setResumeError(
        err?.response?.data?.message ||
          'Failed to save profile'
      )
    }
  }


  //resume related functions
  async function setDefaultResume(id) {
    try {
      await setDefaultResumeApi(id)

      const { data } = await getResumesApi()

      setResumes(data || [])
      setResumeError('')
    } catch (err) {
      setResumeError(
        err?.response?.data?.message ||
          'Failed to set default resume'
      )
    }
  }

  async function changeVisibility(
    id,
    newVisibility
  ) {
    try {
      await updateResumeVisibilityApi(
        id,
        newVisibility
      )

      setResumes(prev =>
        prev.map(r =>
          r.id === id
            ? {
                ...r,
                visibility: newVisibility
              }
            : r
        )
      )
    } catch (err) {
      setResumeError(
        err?.response?.data?.message ||
          'Failed to update visibility'
      )
    }
  }

  async function deleteResume(id) {
    try {
      await deleteResumeApi(id)

      setResumes(prev =>
        prev.filter(r => r.id !== id)
      )
    } catch {
      setResumeError('Failed to delete resume')
    }
  }

  function handleResumeFileChange(e) {
    setResumeError('')
    setSelectedResume(
      e.target.files[0] || null
    )
  }

  function clearResumeInput() {
  if (resumeInputRef.current) {
    resumeInputRef.current.value = ''
  }
}

function resetResumeState() {
  setSelectedResume(null)
  setResumeError('')
  clearResumeInput()
}

async function handleResumeUpload() {
  if (!selectedResume) {
    setResumeError(
      'Please select a file to upload.'
    )
    return
  }

  const formData = new FormData()
  formData.append('file', selectedResume)

  const fallbackFileType =
    selectedResume.name
      .split('.')
      .pop()
      .toUpperCase()

  try {
    const { data } =
      await uploadResumeApi(formData)

    setResumes(prev => {
      const newResume = {
          id: data?.id || Date.now(),
          fileName:
            data?.fileName ||
            selectedResume.name,
          fileType:
            data?.fileType ||
            fallbackFileType,
          isDefault:
            data?.isDefault || false,
          visibility:
            data?.visibility || 'PUBLIC',
          uploadedAt:
            data?.uploadedAt ||
            new Date().toISOString()
        }
      return [...prev, newResume]
    })

    resetResumeState()
  } catch (err) {
    setResumeError(
      err?.response?.data?.message ||
        'Failed to upload resume'
    )

    clearResumeInput()
  }
} //useRef here used for accessing the hidden input element that opens the file picker(This PC)

  return (
    <div className="page-wrapper">
      <Navbar role={profile.role} />

      <main className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>

            <p>
              Manage your personal information
              and{' '}
              {profile.role === 'employer'
                ? 'company details'
                : 'career goals'}
              .
            </p>
          </div>

          <ProfileInfo
            profile={profile}
            isEditing={isEditing}
            handleChange={handleChange}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
          />

          {profile.role === 'seeker' && (
            <>
              <ResumeSection
                resumes={resumes}
                resumeError={resumeError}
                selectedResume={selectedResume}
                resumeInputRef={resumeInputRef}
                handleResumeFileChange={handleResumeFileChange}
                handleResumeUpload={handleResumeUpload}
                changeVisibility={changeVisibility}
                deleteResume={deleteResume}
                setDefaultResume={setDefaultResume}
              />

              <SkillsSection
                skillsList={skillsList}
                skillInput={skillInput}
                skillError={skillError}
                showSkillForm={showSkillForm}
                setShowSkillForm={setShowSkillForm}
                handleSkillChange={handleSkillChange}
                handleAddSkill={handleAddSkill}
                handleDeleteSkill={handleDeleteSkill}
                skillsLoadError={skillsLoadError}
              />

              <ExperienceSection
                experienceList={experienceList}
                expForm={expForm}
                expError={expError}
                showExpForm={showExpForm}
                editExpId={editExpId}
                setShowExpForm={setShowExpForm}
                handleExpChange={handleExpChange}
                handleAddOrUpdateExperience={handleAddOrUpdateExperience}
                handleEditExperience={handleEditExperience}
                handleDeleteExperience={handleDeleteExperience}
                setEditExpId={setEditExpId}
                setExpError={setExpError}
              />

              <EducationSection
                educationList={educationList}
                eduForm={eduForm}
                eduError={eduError}
                showEduForm={showEduForm}
                editEduId={editEduId}
                setShowEduForm={setShowEduForm}
                handleEduChange={handleEduChange}
                handleAddOrUpdateEducation={handleAddOrUpdateEducation}
                handleEditEducation={handleEditEducation}
                handleDeleteEducation={handleDeleteEducation}
                setEditEduId={setEditEduId}
                setEduError={setEduError}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobSeekerProfile
