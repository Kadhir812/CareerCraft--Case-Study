class JobDTO:
    def __init__(self, title: str, description: str, location: str, salary: float, required_skills: str):
        self.title = title
        self.description = description
        self.location = location
        self.salary = salary
        self.required_skills = required_skills
