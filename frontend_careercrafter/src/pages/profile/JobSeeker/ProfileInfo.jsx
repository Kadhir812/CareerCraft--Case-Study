import Button from '../../../components/Button'

const ProfileInfo = ({
  profile,
  isEditing,
  handleChange,
  handleSave,
  setIsEditing
}) => {


    return (
        <div className="profile-card">
        <div className="form-group form-row">
            <div>
            <label>Full Name</label>

            <input
                type="text"
                name="name"
                className="form-input"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>

            <div>
            <label>Email Address</label>

            <input
                type="email"
                name="email"
                className="form-input"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>
        </div>

        <div className="form-group form-row">
            <div>
            <label>Phone Number</label>

            <input
                type="tel"
                name="phone"
                className="form-input"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>

            <div>
            <label>Location</label>

            <input
                type="text"
                name="location"
                className="form-input"
                value={profile.location}
                onChange={handleChange}
                disabled={!isEditing}
            />
            </div>
        </div>

        <div className="form-group">
            <label>Bio</label>

            <textarea
            name="bio"
            className="form-input"
            value={profile.bio}
            onChange={handleChange}
            disabled={!isEditing}
            />
        </div>

        {profile.role === 'employer' && (
    <>
        <div className="form-group form-row">
        <div>
            <label>Company Name</label>

            <input
            type="text"
            name="companyName"
            className="form-input"
            value={profile.companyName}
            onChange={handleChange}
            disabled={!isEditing}
            />
        </div>

        <div>
            <label>Company Website</label>

            <input
            type="url"
            name="companyWebsite"
            className="form-input"
            value={profile.companyWebsite}
            onChange={handleChange}
            disabled={!isEditing}
            />
        </div>
        </div>

        <div className="form-group form-row">
        <div>
            <label>Industry</label>

            <input
            type="text"
            name="industry"
            className="form-input"
            value={profile.industry}
            onChange={handleChange}
            disabled={!isEditing}
            />
        </div>

        <div>
            <label>Verification Status</label>

            <input
            type="text"
            className="form-input"
            value={profile.verifiedStatus}
            disabled
            />
        </div>
        </div>
    </>
    )}

        <div className="profile-actions">
            {isEditing ? (
            <>
                <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                >
                Cancel
                </Button>

                <Button onClick={handleSave}>
                Save Changes
                </Button>
            </>
            ) : (
            <Button onClick={() => setIsEditing(true)}>
                Edit Profile
            </Button>
            )}
        </div>
        </div>
    )
    }

    export default ProfileInfo