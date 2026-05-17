import Button from '../../../components/Button'

const ResumeSection = ({
  resumes,
  resumeError,
  selectedResume,
  resumeInputRef,
  handleResumeFileChange,
  handleResumeUpload,
  changeVisibility,
  deleteResume,
  setDefaultResume
}) => {


  return (
        <div className="profile-card">
        <h2>My Resumes</h2>

        <div
            style={{
            margin: '12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8
            }}
        >
            <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={resumeInputRef}
            onChange={handleResumeFileChange}
            style={{ display: 'none' }}
            />

            <Button
            size="sm"
            disabled={resumes.length >= 3}
            onClick={() =>
                selectedResume
                ? handleResumeUpload()
                : resumeInputRef.current?.click()
            }
            >
            {selectedResume
                ? 'Upload Resume'
                : 'Choose File'}
            </Button>

            {selectedResume && (
            <span>{selectedResume.name}</span>
            )}

            <span style={{ color: 'red' }}>
            {resumeError}
            </span>
        </div>

        <div
            style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
            }}
        >
            {resumes.length === 0 ? (
            <div>No resumes uploaded yet.</div>
            ) : (
            resumes.map(r => (
                <div
                key={r.id}
                className="entry-card"
                >
                <div className="entry-header">
                    <div>{r.fileName}</div>

                    {r.isDefault && (
                    <span className="badge badge-green">
                        Default
                    </span>
                    )}
                </div>

                <div>Type: {r.fileType}</div>

                <div>
                    Visibility:

                    <select
                    value={r.visibility}
                    onChange={e =>
                        changeVisibility(
                        r.id,
                        e.target.value
                        )
                    }
                    >
                    <option value="PRIVATE">
                        Private
                    </option>

                    <option value="EMPLOYERS_ONLY">
                        Employers Only
                    </option>
                    </select>
                </div>

                <div>
                    Uploaded:
                    {' '}
                    {new Date(
                    r.uploadedAt
                    ).toLocaleString()}
                </div>

                <div
                    style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 8
                    }}
                >
                    <Button
                    size="sm"
                    variant="outline"
                    disabled={r.isDefault}
                    onClick={() =>
                        setDefaultResume(r.id)
                    }
                    >
                    Set Default
                    </Button>

                    <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        deleteResume(r.id)
                    }
                    >
                    Delete
                    </Button>
                </div>
                </div>
            ))
            )}
        </div>
        </div>
    )
    }

export default ResumeSection