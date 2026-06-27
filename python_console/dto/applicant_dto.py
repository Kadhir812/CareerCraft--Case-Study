class ApplicantDTO:
    def __init__(self, application_id, job_id, job_title, resume_id, qualification,
                 experience, skills, applicant_name, phone_number,
                 status):
        self.application_id = application_id
        self.job_id = job_id
        self.job_title = job_title
        self.resume_id = resume_id
        self.qualification = qualification
        self.experience = experience
        self.skills = skills
        self.applicant_name = applicant_name
        self.phone_number = phone_number
        self.status = status
