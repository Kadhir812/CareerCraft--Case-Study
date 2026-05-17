import Button from '../../../components/Button'
import React from 'react'

const ExperienceSection = ({
  experienceList,
  expForm,
  expError,
  showExpForm,
  editExpId,
  setShowExpForm,
  handleExpChange,
  handleAddOrUpdateExperience,
  handleEditExperience,
  handleDeleteExperience,
  setEditExpId,
  setExpError
}) => {
  function closeForm() {
    setShowExpForm(false)
    setEditExpId(null)
    setExpError('')
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
        <h3>Work Experience</h3>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowExpForm(v => !v)}
        >
          + Add Experience
        </Button>
      </div>

      {experienceList.length === 0 ? (
        <div
          style={{
            color: '#888',
            padding: 16
          }}
        >
          No experience added yet.
        </div>
      ) : (
        experienceList.map(exp => (
          <React.Fragment key={exp.id}>
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
                  {exp.position}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      handleEditExperience(exp)
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
                      handleDeleteExperience(exp.id)
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

              <div className="entry-subtitle">
                {exp.company} - {exp.location}
              </div>

              <div className="entry-duration">
                {exp.startDate} -{' '}
                {exp.endDate || 'Present'}
              </div>

              <div className="entry-desc">
                {exp.description}
              </div>
            </div>

            {showExpForm &&
              editExpId === exp.id && (
                <ExperienceForm
                  expForm={expForm}
                  expError={expError}
                  handleExpChange={handleExpChange}
                  handleSubmit={
                    handleAddOrUpdateExperience
                  }
                  closeForm={closeForm}
                  buttonText="Save"
                />
              )}
          </React.Fragment>
        ))
      )}

      {showExpForm && !editExpId && (
        <ExperienceForm
          expForm={expForm}
          expError={expError}
          handleExpChange={handleExpChange}
          handleSubmit={
            handleAddOrUpdateExperience
          }
          closeForm={closeForm}
          buttonText="Add Experience"
        />
      )}
    </div>
  )
}

const ExperienceForm = ({
  expForm,
  expError,
  handleExpChange,
  handleSubmit,
  closeForm,
  buttonText
}) => {
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
          <label>Company *</label>

          <input
            type="text"
            name="company"
            className="form-input"
            value={expForm.company}
            onChange={handleExpChange}
            required
          />
        </div>

        <div>
          <label>Position *</label>

          <input
            type="text"
            name="position"
            className="form-input"
            value={expForm.position}
            onChange={handleExpChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Start Date *</label>

          <input
            type="date"
            name="startDate"
            className="form-input"
            value={expForm.startDate}
            onChange={handleExpChange}
            required
          />
        </div>

        <div>
          <label>End Date</label>

          <input
            type="date"
            name="endDate"
            className="form-input"
            value={expForm.endDate}
            onChange={handleExpChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div style={{ width: '100%' }}>
          <label>Location</label>

          <input
            type="text"
            name="location"
            className="form-input"
            value={expForm.location}
            onChange={handleExpChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div style={{ width: '100%' }}>
          <label>Description</label>

          <input
            type="text"
            name="description"
            className="form-input"
            value={expForm.description}
            onChange={handleExpChange}
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
          {expError}
        </span>
      </div>
    </form>
  )
}

export default ExperienceSection