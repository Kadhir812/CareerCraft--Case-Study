class Resume:
    def __init__(self, resume_id, user_id, resume_name, qualification, experience, skills, created_at=None, updated_at=None):
        self.resume_id = resume_id
        self.user_id = user_id
        self.resume_name = resume_name
        self.qualification = qualification
        self.experience = experience
        self.skills = skills
        self.created_at = created_at
        self.updated_at = updated_at
