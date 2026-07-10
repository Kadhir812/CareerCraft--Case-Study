from repository.resume_repository import ResumeRepository
from exceptions.custom_exceptions import InvalidResumeException
from model.resume import Resume
from utils.skills_helper import add_skills

class ResumeService:

    def __init__(self, user_id):
        self.repo = ResumeRepository()
        self.user_id = user_id

    def _validate_resume(self, dto):
        if not dto.resume_name or not dto.resume_name.strip():
            raise InvalidResumeException("Resume name cannot be empty.")

        if not isinstance(dto.qualification, str) or not dto.qualification.strip():
            raise InvalidResumeException("Qualification must be a non-empty string.")

        if not isinstance(dto.experience, int) or dto.experience < 0:
            raise InvalidResumeException("Experience must be a non-negative integer.")

        if not isinstance(dto.skills, str) or not dto.skills.strip():
            raise InvalidResumeException("Skills must be a non-empty string.")

        skills = dto.skills
        cleaned = add_skills(*skills.split(','))
        if not cleaned:
            raise InvalidResumeException("Skills must contain at least one valid entry")
        dto.skills = cleaned

    def upload_resume(self, dto):
        self._validate_resume(dto)

        resume = Resume(
            resume_id=None,
            user_id=self.user_id,
            resume_name=dto.resume_name,
            qualification=dto.qualification,
            experience=dto.experience,
            skills=dto.skills,
        )
        self.repo.save(resume)
        return True

    def list_resumes(self):
        resumes = self.repo.find_by_user(self.user_id)
        for resume in resumes:
            yield resume
