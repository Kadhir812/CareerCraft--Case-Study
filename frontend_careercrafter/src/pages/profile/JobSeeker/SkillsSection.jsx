import Button from '../../../components/Button'

 const SkillsSection = ({
  skillsList,
  skillInput,
  skillError,
  showSkillForm,
  setShowSkillForm,
  handleSkillChange,
  handleAddSkill,
  handleDeleteSkill,
  skillsLoadError
}) => {
  return (
    <div className="profile-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3>Skills</h3>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowSkillForm(v => !v)}
        >
          + Add Skill
        </Button>
      </div>

      <div className="skills-container" style={{ marginTop: 16 }}>
        {skillsLoadError && (
          <div style={{ color: 'red' }}>
            {skillsLoadError}
          </div>
        )}

        {!skillsLoadError && skillsList.length === 0 && (
          <div style={{ color: '#888' }}>
            No skills added yet.
          </div>
        )}

        {skillsList.map(skill => (
          <div
            key={skill.id}
            className="skill-tag"
          >
            {skill.skillName}

            <span
              onClick={() => handleDeleteSkill(skill.id)}
              style={{
                marginLeft: 8,
                color: 'red',
                cursor: 'pointer'
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {showSkillForm && (
        <form
          onSubmit={handleAddSkill}
          style={{ marginTop: 16 }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8
            }}
          >
            <input
              type="text"
              className="form-input"
              value={skillInput}
              onChange={handleSkillChange}
              placeholder="Add a skill..."
            />

            <Button type="submit" size="sm">
              Add
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowSkillForm(false)}
            >
              Cancel
            </Button>
          </div>

          <span style={{ color: 'red' }}>
            {skillError}
          </span>
        </form>
      )}
    </div>
  )
}

export default SkillsSection