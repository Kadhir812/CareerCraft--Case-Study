from repository.profile_repository import ProfileRepository
from model.profile import Profile
from dto.profile_dto import ProfileDTO
from exceptions.custom_exceptions import InvalidProfileException
from utils.skills_helper import add_skills


class ProfileService:
    def __init__(self):
        self.repo = ProfileRepository()

    def _validate_profile_dto(self, profile_dto):
        if not isinstance(profile_dto.qualification, str) or not profile_dto.qualification.strip():
            raise InvalidProfileException("Qualification must be a non-empty string")

        if not isinstance(profile_dto.experience, int) or profile_dto.experience < 0:
            raise InvalidProfileException("Experience must be a non-negative integer")

        if not isinstance(profile_dto.skills, str) or not profile_dto.skills.strip():
            raise InvalidProfileException("Skills must be a non-empty string")

        skills = profile_dto.skills
        cleaned = add_skills(*skills.split(','))
        if not cleaned:
            raise InvalidProfileException("Skills must contain at least one valid entry")
        profile_dto.skills = cleaned

    def create_profile(self, profile_dto, user_id):
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

    def get_profile(self, user_id):
        profile = self.repo.find_by_user_id(user_id)
        if not profile:
            return None

        return ProfileDTO(
            qualification=profile.qualification,
            experience=profile.experience,
            skills=profile.skills,
        )
