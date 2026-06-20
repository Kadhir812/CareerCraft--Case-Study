from dto.job_dto import JobDTO
from typing import Generator
from model.job import Job
from repository.job_repository import JobRepository
from utils.skills_helper import add_skills

class JobService:
    def __init__(self, employer_id: int):
        self.employer_id = employer_id
        self.repo = JobRepository()

    def _validate_job(self, dto: JobDTO) -> None:
        if not dto.title or not dto.title.strip():
            raise ValueError("Title must be a non‑empty string")
        if not dto.description or not dto.description.strip():
            raise ValueError("Description must be a non‑empty string")
        if not dto.location or not dto.location.strip():
            raise ValueError("Location must be a non‑empty string")
        if not isinstance(dto.salary, (int, float)) or dto.salary < 0:
            raise ValueError("Salary must be a non‑negative number")
        if not isinstance(dto.required_skills, str) or not dto.required_skills.strip():
            raise ValueError("Required skills must be a non‑empty string")

        cleaned = add_skills(*dto.required_skills.split(','))
        if not cleaned:
            raise ValueError("At least one valid skill is required")
        dto.required_skills = cleaned

    def post_job(self, dto: JobDTO) -> bool:
        """Validate and persist a new job posting.
        Returns True on success.
        """
        self._validate_job(dto)
        job = Job(
            job_id=None,
            employer_id=self.employer_id,
            title=dto.title,
            description=dto.description,
            location=dto.location,
            salary=dto.salary,
            required_skills=dto.required_skills,
        )
        self.repo.save(job)
        return True

    def get_my_jobs(self):
        jobs = self.repo.find_by_employer(self.employer_id)
        for job in jobs:
            yield job
