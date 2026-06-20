class Job:
    def __init__(self, job_id: int | None, employer_id: int,
                 title: str, description: str, location: str,
                 salary: float, required_skills: str):
        self.job_id = job_id
        self.employer_id = employer_id
        self.title = title
        self.description = description
        self.location = location
        self.salary = salary
        self.required_skills = required_skills
