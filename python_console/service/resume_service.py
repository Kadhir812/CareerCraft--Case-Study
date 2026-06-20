# d:/CareerCraft/python_console/service/resume_service.py
from repository.resume_repository import ResumeRepository
from dto.resume_dto import ResumeDTO
from model.resume import Resume
from utils.skills_helper import add_skills
class ResumeService:

    def __init__(self, user_id: int):
        self.repo = ResumeRepository()
        self.user_id = user_id


    def _validate_resume(self, dto: ResumeDTO) -> None:
        if not dto.resume_name or not dto.resume_name.strip():
            raise ValueError("Resume name cannot be empty.")

        if not isinstance(dto.qualification, str) or not dto.qualification.strip():
            raise ValueError("Qualification must be a non‑empty string.")

        if not isinstance(dto.experience, int) or dto.experience < 0:
            raise ValueError("Experience must be a non‑negative integer.")

        if not isinstance(dto.skills, str) or not dto.skills.strip():
            raise ValueError("Skills must be a non‑empty string.")

        cleaned = add_skills(*dto.skills.split(','))
        if not cleaned:
            raise ValueError("Skills must contain at least one valid entry")
        dto.skills = cleaned

    def upload_resume(self, dto: ResumeDTO) -> bool:
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

    def list_resumes(self) -> list[Resume]:
        return self.repo.find_by_user(self.user_id)
