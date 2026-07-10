from exceptions.custom_exceptions import InvalidJobException
from model.job import Job
from repository.job_repository import JobRepository
from utils.constants import ROLE_EMPLOYER
from utils.decorators import require_role
from utils.skills_helper import add_skills

class JobService:
    def __init__(self, employer_id):
        self.employer_id = employer_id
        self.repo = JobRepository()

    def _validate_job(self, dto):
        if not dto.title or not dto.title.strip():
            raise InvalidJobException("Title must be a non-empty string")

        if not dto.description or not dto.description.strip():
            raise InvalidJobException("Description must be a non-empty string")

        if not dto.location or not dto.location.strip():
            raise InvalidJobException("Location must be a non-empty string")

        if not isinstance(dto.required_skills, str) or not dto.required_skills.strip():
            raise InvalidJobException("Required skills must be a non-empty string")

        skills = dto.required_skills
        cleaned = add_skills(*skills.split(','))
        if not cleaned:
            raise InvalidJobException("At least one valid skill is required")
        dto.required_skills = cleaned

    def post_job(self, dto):
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

    @require_role(ROLE_EMPLOYER)
    def delete_job(self, job_id):
        deleted = self.repo.delete_by_id_for_employer(job_id, self.employer_id)
        return deleted
