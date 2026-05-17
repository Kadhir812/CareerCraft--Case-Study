import React from 'react'
import Button from '../../../components/Button'

export default function EducationSection({
  educationList,
  eduForm,
  eduError,
  showEduForm,
  editEduId,
  setShowEduForm,
  handleEduChange,
  handleAddOrUpdateEducation,
  handleEditEducation,
  handleDeleteEducation,
  setEditEduId,
  setEduError
}) {
  function closeForm() {
    setShowEduForm(false)
    setEditEduId(null)
    setEduError('')
  }

  return (
    <div className="profile-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3>Education</h3>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowEduForm(v => !v)}
        >
          + Add Education
        </Button>
      </div>

      {educationList.length === 0 ? (
        <div
          style={{
            color: '#888',
            padding: 16
          }}
        >
          No education added yet.
        </div>
      ) : (
        educationList.map(edu => (
          <React.Fragment key={edu.id}>
            <div className="entry-card">
              <div
                className="entry-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div className="entry-title">
                  {edu.degree}
                  {edu.fieldOfStudy &&
                    ` - ${edu.fieldOfStudy}`}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      handleEditEducation(edu)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: 6
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteEducation(edu.id)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {edu.grade && (
                <div className="entry-desc">
                  Grade: {edu.grade}
                </div>
              )}

              <div className="entry-subtitle">
                {edu.institution}
              </div>

              <div className="entry-duration">
                Graduation: {edu.graduationDate}
              </div>

              <div className="entry-desc">
                {edu.description}
              </div>
            </div>

            {showEduForm &&
              editEduId === edu.id && (
                <EducationForm
                  eduForm={eduForm}
                  eduError={eduError}
                  handleEduChange={handleEduChange}
                  handleSubmit={
                    handleAddOrUpdateEducation
                  }
                  closeForm={closeForm}
                  buttonText="Save"
                />
              )}
          </React.Fragment>
        ))
      )}

      {showEduForm && !editEduId && (
        <EducationForm
          eduForm={eduForm}
          eduError={eduError}
          handleEduChange={handleEduChange}
          handleSubmit={
            handleAddOrUpdateEducation
          }
          closeForm={closeForm}
          buttonText="Add Education"
        />
      )}
    </div>
  )
}

function EducationForm({
  eduForm,
  eduError,
  handleEduChange,
  handleSubmit,
  closeForm,
  buttonText
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="form-group"
      style={{
        marginTop: 20,
        background: '#f8fafc',
        padding: 16,
        borderRadius: 8
      }}
    >
      <div className="form-row">
        <div>
          <label>Institution *</label>

          <input
            type="text"
            name="institution"
            className="form-input"
            value={eduForm.institution}
            onChange={handleEduChange}
            required
          />
        </div>

        <div>
          <label>Degree *</label>

          <input
            type="text"
            name="degree"
            className="form-input"
            value={eduForm.degree}
            onChange={handleEduChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Field of Study</label>

          <input
            type="text"
            name="fieldOfStudy"
            className="form-input"
            value={eduForm.fieldOfStudy}
            onChange={handleEduChange}
          />
        </div>

        <div>
          <label>Grade</label>

          <input
            type="text"
            name="grade"
            className="form-input"
            value={eduForm.grade}
            onChange={handleEduChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Graduation Date *</label>

          <input
            type="date"
            name="graduationDate"
            className="form-input"
            value={eduForm.graduationDate}
            onChange={handleEduChange}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <input
            type="text"
            name="description"
            className="form-input"
            value={eduForm.description}
            onChange={handleEduChange}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 10
        }}
      >
        <Button type="submit" size="sm">
          {buttonText}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={closeForm}
        >
          Cancel
        </Button>

        <span
          style={{
            color: 'red',
            fontSize: 13
          }}
        >
          {eduError}
        </span>
      </div>
    </form>
  )
}