from repository.profile_repository import ProfileRepository
from model.profile import Profile
from dto.profile_dto import ProfileDTO
from utils.skills_helper import add_skills


class ProfileService:
    def __init__(self):
        self.repo = ProfileRepository()

    def _validate_profile_dto(self, profile_dto: ProfileDTO) -> None:
        if not isinstance(profile_dto.qualification, str) or not profile_dto.qualification.strip():
            raise ValueError("Qualification must be a non‑empty string")

        if not isinstance(profile_dto.experience, int) or profile_dto.experience < 0:
            raise ValueError("Experience must be a non‑negative integer")

        if not isinstance(profile_dto.skills, str) or not profile_dto.skills.strip():
            raise ValueError("Skills must be a non‑empty string")

       
        cleaned = add_skills(*profile_dto.skills.split(','))
        if not cleaned:
            raise ValueError("Skills must contain at least one valid entry")
        profile_dto.skills = cleaned

    def create_profile(self, profile_dto: ProfileDTO, user_id: int) -> bool:
        self._validate_profile_dto(profile_dto)

        profile = Profile(
            profile_id=None,
            user_id=user_id,
            qualification=profile_dto.qualification,
            experience=profile_dto.experience,
            skills=profile_dto.skills,
        )
        self.repo.save(profile)
        return True
