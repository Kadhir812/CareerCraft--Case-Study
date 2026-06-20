from auth.auth_service import AuthService


class AuthController:

    def __init__(self):
        self.auth_service = AuthService()

    def register(self, user):
        """Register a new user, handling duplicates and validation errors."""
        try:
            self.auth_service.register(user)
            print("\nRegistration successful! You can now login.")
        except Exception as e:
            print(f"Registration failed: {e}")

    def login(self, user):
        """Login an existing user and return a JWT token. Handles authentication errors."""
        try:
            token = self.auth_service.login(user)
            print("\nLogin Success")
            print("JWT Token:")
            print(token)
            return token
        except Exception as e:
            print(f"Login failed: {e}")
            return None