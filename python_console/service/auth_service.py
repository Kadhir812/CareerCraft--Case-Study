from repository.user_repository import UserRepository

from utils.auth_helper import validate_email

from exceptions.custom_exceptions import InvalidRoleException




class AuthService:

    def __init__(self):
        self.user_repo = UserRepository()

    def register(self, user):
        validate_email(user.email)

        if user.role not in ["EMPLOYER", "JOBSEEKER"]:
            raise InvalidRoleException(
                "Role must be EMPLOYER or JOBSEEKER"
            )

        self.user_repo.save(user)
