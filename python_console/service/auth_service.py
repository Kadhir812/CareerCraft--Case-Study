from dto.login_dto import LoginDTO
from dto.register_dto import RegisterDTO
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
from utils.logger import get_logger

logger = get_logger(__name__)


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
        logger.info("Registering user: email=%s role=%s", dto.email, dto.role)
        validate_email(dto.email)

        if dto.role not in VALID_ROLES:
            logger.warning("Role is invalid: email=%s role=%s", dto.email, dto.role)
            raise InvalidRoleException()

        if dto.role == ROLE_EMPLOYER and not dto.company_name:
            logger.warning("Company name is missing: email=%s", dto.email)
            raise CompanyNameRequiredException()

    # we explicitly pass none here so constructor assigns none for null values
        hashed_password = self._hash_password(dto.password)
        user = User(None, dto.name, dto.email, hashed_password, dto.role, dto.company_name)
        saved_user = self.user_repo.save(user)
        
        logger.info("User registered: user_id=%s role=%s", saved_user.user_id, saved_user.role)
        return saved_user



    def login(self, dto):
        logger.info("Authenticating user: email=%s", dto.email)
        try:
            validate_email(dto.email)
        except InvalidEmailException as exc:
            logger.warning("Login failed because email is invalid: email=%s", dto.email)
            raise AuthenticationFailedException()

        stored_user = self.user_repo.find_by_email(dto.email)
        if not stored_user or not self._verify_password(dto.password, stored_user.password):
            logger.warning("Credentials are invalid: email=%s", dto.email)
            raise AuthenticationFailedException()

        if stored_user.role not in VALID_ROLES:
            logger.warning("Role is unauthorized: user_id=%s role=%s", stored_user.user_id, stored_user.role)
            raise AuthenticationFailedException()

        token = JwtHandler.generate_token(stored_user)
        logger.info("JWT generated for user: user_id=%s role=%s", stored_user.user_id, stored_user.role)
        return token

    def validate(self, token):
        payload = JwtHandler.verify_token(token)
        if payload:
            logger.info("JWT validated: user_id=%s role=%s", payload.get("user_id"), payload.get("role"))
        else:
            logger.warning("JWT validation failed")
        return payload
