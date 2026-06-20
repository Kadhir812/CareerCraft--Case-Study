
# pyrefly: ignore [missing-import]
import jwt
from datetime import datetime, timedelta, timezone
from exceptions.custom_exceptions import UnauthorizedException

SECRET_KEY = "career_crafter_super_secret_key_2026_hexaware_project"


class JwtHandler:

    @staticmethod
    def generate_token(user):

        payload = {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1)
        }

        token = jwt.encode(
            payload,
            SECRET_KEY,
            algorithm="HS256"
        )

        return token

    @staticmethod
    def verify_token(token):

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

            return payload

        except jwt.ExpiredSignatureError:
            print("Token Expired")

        except jwt.InvalidTokenError:
            print("Invalid Token")