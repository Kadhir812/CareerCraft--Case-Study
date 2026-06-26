class UserApplicationDTO:
    def __init__(self, job_id: int, job_title: str, company: str, status: str, applied_at):
        self.job_id = job_id
        self.job_title = job_title
        self.company = company
        self.status = status
        self.applied_at = applied_at
