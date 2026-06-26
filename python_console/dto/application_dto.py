from utils.constants import STATUS_APPLIED


class ApplicationDTO:
    def __init__(self, job_id: int, resume_id: int, phone_number: str, user_id: int, status: str = STATUS_APPLIED):
        self.job_id = job_id
        self.resume_id = resume_id
        self.phone_number = phone_number
        self.user_id = user_id
        self.status = status
