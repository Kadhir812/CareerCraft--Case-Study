import bcrypt
from exceptions.custom_exceptions import (
    AuthenticationFailedException,
    CompanyNameRequiredException,
    InvalidEmailException,
    InvalidRoleException,
)
from model.user import User
from repository.user_repository import UserRepository
from utils.auth_helper import validate_email
from utils.constants import ROLE_EMPLOYER, VALID_ROLES
from utils.jwt_handler import JwtHandler


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    def _hash_password(self, password):
        password_bytes = password.encode("utf-8")
        hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        return hashed.decode("utf-8")

    def _verify_password(self, plain_password, hashed_password):
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )

    def register(self, dto):
        validate_email(dto.email)

        if dto.role not in VALID_ROLES:
            raise InvalidRoleException()

        if dto.role == ROLE_EMPLOYER and not dto.company_name:
            raise CompanyNameRequiredException()

        # user_id is None until the repo inserts the row and assigns one
        hashed_password = self._hash_password(dto.password)
        user = User(None, dto.name, dto.email, hashed_password, dto.role, dto.company_name)
        saved_user = self.user_repo.save(user)

        return saved_user

    def login(self, dto):
        try:
            validate_email(dto.email)
        except InvalidEmailException:
            raise AuthenticationFailedException()

        stored_user = self.user_repo.find_by_email(dto.email)
        if not stored_user or not self._verify_password(dto.password, stored_user.password):
            raise AuthenticationFailedException()

        if stored_user.role not in VALID_ROLES:
            raise AuthenticationFailedException()

        token = JwtHandler.generate_token(stored_user)
        return token

    def validate(self, token):
        payload = JwtHandler.verify_token(token)
        return payload
