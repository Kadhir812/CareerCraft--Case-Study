class UserApplicationDTO:
    def __init__(self, job_id, job_title, company, status, applied_at):
        self.job_id = job_id
        self.job_title = job_title
        self.company = company
        self.status = status
        self.applied_at = applied_at
