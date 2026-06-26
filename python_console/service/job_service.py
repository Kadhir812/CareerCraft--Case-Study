from dto.job_dto import JobDTO
from exceptions.custom_exceptions import InvalidJobException
from model.job import Job
from repository.job_repository import JobRepository
from utils.skills_helper import add_skills
from utils.logger import get_logger

logger = get_logger(__name__)

class JobService:
    def __init__(self, employer_id: int):
        self.employer_id = employer_id
        self.repo = JobRepository()

    def _validate_job(self, dto: JobDTO) -> None:
        if not dto.title or not dto.title.strip():
            logger.warning("Job validation failed: employer_id=%s reason=missing_title", self.employer_id)
            raise InvalidJobException("Title must be a non-empty string")
        
        if not dto.description or not dto.description.strip():
            logger.warning("Job validation failed: employer_id=%s reason=missing_description", self.employer_id)
            raise InvalidJobException("Description must be a non-empty string")
        
        if not dto.location or not dto.location.strip():
            logger.warning("Job validation failed: employer_id=%s reason=missing_location", self.employer_id)
            raise InvalidJobException("Location must be a non-empty string")
        
        if not isinstance(dto.salary, (int, float)) or dto.salary < 0:
            logger.warning("Job validation failed: employer_id=%s reason=invalid_salary", self.employer_id)
            raise InvalidJobException("Salary must be a non-negative number")
        
        if not isinstance(dto.required_skills, str) or not dto.required_skills.strip():
            logger.warning("Job validation failed: employer_id=%s reason=missing_skills", self.employer_id)
            raise InvalidJobException("Required skills must be a non-empty string")

        cleaned = add_skills(*dto.required_skills.split(','))
        if not cleaned:
            logger.warning("Job validation failed: employer_id=%s reason=no_valid_skills", self.employer_id)
            raise InvalidJobException("At least one valid skill is required")
        dto.required_skills = cleaned

    def post_job(self, dto: JobDTO) -> bool:
        self._validate_job(dto)
        logger.info("Posting job: employer_id=%s title=%s location=%s", self.employer_id, dto.title, dto.location)
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
        logger.info("Job posted: employer_id=%s title=%s", self.employer_id, dto.title)
        return True

    def get_my_jobs(self):
        jobs = self.repo.find_by_employer(self.employer_id)
        logger.info("Fetched employer jobs: employer_id=%s count=%s", self.employer_id, len(jobs))
        for job in jobs:
            yield job
