from auth.jwt_handler import JwtHandler
from repository.user_repository import UserRepository
from exceptions.custom_exceptions import (
    InvalidEmailException,
    UserAlreadyExistsException,
    AuthenticationFailedException,
)
from utils.auth_helper import validate_email


class AuthService:

    def __init__(self):
        self.user_repo = UserRepository()

    def login(self, user):
        # Validate email format
        try:
            validate_email(user.email)
        except InvalidEmailException as e:
            raise AuthenticationFailedException(str(e))
        # Retrieve stored user
        stored_user = self.user_repo.find_by_email(user.email)
        if not stored_user or stored_user.password != user.password:
            raise AuthenticationFailedException("Invalid email or password")
        # Generate JWT token
        token = JwtHandler.generate_token(stored_user)
        return token

    def register(self, user):
        """Register a new user with validation and DB persistence.
        Raises:
            InvalidEmailException: If the email format is invalid.
            UserAlreadyExistsException: If a user with the same email already exists.
        """
        # Validate email using regex validator
        validate_email(user.email)
        # Attempt to save the user; repository will raise UserAlreadyExistsException on duplicate
        saved_user = self.user_repo.save(user)
        return saved_user

    def validate(self, token):
        return JwtHandler.verify_token(token)