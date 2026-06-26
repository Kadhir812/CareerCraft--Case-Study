# pyrefly: ignore [missing-import]
import jwt
from datetime import datetime, timedelta
from utils.logger import get_logger

SECRET_KEY = "career_crafter_super_secret_key_2026_hexaware_project"
logger = get_logger(__name__)


class JwtHandler:
    @staticmethod
    def generate_token(user):
        payload = {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "company_name": user.company_name,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1),
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        logger.info("JWT token generated: user_id=%s role=%s", user.user_id, user.role)
        return token

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            logger.info("JWT token verified: user_id=%s role=%s", payload.get("user_id"), payload.get("role"))
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token expired")
            print("Token Expired")
        except jwt.InvalidTokenError:
            logger.warning("JWT token invalid")
            print("Invalid Token")

        return None
