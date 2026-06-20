class ApplicantDTO:
    def __init__(self, application_id: int, job_id: int, job_title: str, resume_id: int, qualification: str,
                 experience: str, skills: str, applicant_name: str, phone_number: str,
                 status: str):
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
