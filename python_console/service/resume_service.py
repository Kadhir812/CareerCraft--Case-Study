# d:/CareerCraft/python_console/service/resume_service.py
from repository.resume_repository import ResumeRepository
from dto.resume_dto import ResumeDTO
from exceptions.custom_exceptions import InvalidResumeException
from model.resume import Resume
from utils.skills_helper import add_skills
from utils.logger import get_logger

logger = get_logger(__name__)

class ResumeService:

    def __init__(self, user_id: int):
        self.repo = ResumeRepository()
        self.user_id = user_id


    def _validate_resume(self, dto: ResumeDTO) -> None:
        if not dto.resume_name or not dto.resume_name.strip():
            logger.warning("Resume validation failed: user_id=%s reason=missing_resume_name", self.user_id)
            raise InvalidResumeException("Resume name cannot be empty.")

        if not isinstance(dto.qualification, str) or not dto.qualification.strip():
            logger.warning("Resume validation failed: user_id=%s reason=missing_qualification", self.user_id)
            raise InvalidResumeException("Qualification must be a non-empty string.")

        if not isinstance(dto.experience, int) or dto.experience < 0:
            logger.warning("Resume validation failed: user_id=%s reason=invalid_experience", self.user_id)
            raise InvalidResumeException("Experience must be a non-negative integer.")

        if not isinstance(dto.skills, str) or not dto.skills.strip():
            logger.warning("Resume validation failed: user_id=%s reason=missing_skills", self.user_id)
            raise InvalidResumeException("Skills must be a non-empty string.")

        cleaned = add_skills(*dto.skills.split(','))
        if not cleaned:
            logger.warning("Resume validation failed: user_id=%s reason=no_valid_skills", self.user_id)
            raise InvalidResumeException("Skills must contain at least one valid entry")
        dto.skills = cleaned

    def upload_resume(self, dto: ResumeDTO) -> bool:
        self._validate_resume(dto)
        logger.info("Uploading resume: user_id=%s resume_name=%s", self.user_id, dto.resume_name)

        resume = Resume(
            resume_id=None,
            user_id=self.user_id,
            resume_name=dto.resume_name,
            qualification=dto.qualification,
            experience=dto.experience,
            skills=dto.skills,
        )
        self.repo.save(resume)
        logger.info("Resume uploaded: user_id=%s resume_name=%s", self.user_id, dto.resume_name)
        return True

    def list_resumes(self):
        resumes = self.repo.find_by_user(self.user_id)
        logger.info("Fetched resumes: user_id=%s count=%s", self.user_id, len(resumes))
        for resume in resumes:
            yield resume
