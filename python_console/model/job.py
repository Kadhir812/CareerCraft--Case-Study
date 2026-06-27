class Job:
    def __init__(self, job_id, employer_id,
                 title, description, location,
                 salary, required_skills):
        self.job_id = job_id
        self.employer_id = employer_id
        self.title = title
        self.description = description
        self.location = location
        self.salary = salary
        self.required_skills = required_skills
