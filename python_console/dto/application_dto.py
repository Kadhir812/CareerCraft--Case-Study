class ApplicationDTO:
    def __init__(self, job_id, resume_id, phone_number, user_id, status="Applied"):
        self.job_id = job_id
        self.resume_id = resume_id
        self.phone_number = phone_number
        self.user_id = user_id
        self.status = status
