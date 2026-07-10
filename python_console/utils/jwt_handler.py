import jwt
from datetime import datetime, timedelta, timezone
from utils.logger import get_logger

SECRET_KEY = "career_crafter_super_secret_key_2026_hexaware_project"
logger = get_logger(__name__)


class JwtHandler:
    @staticmethod
    def generate_token(user):
        issued_at = datetime.now(timezone.utc)
        expires_at = issued_at + timedelta(hours=1)
        payload = {
            "user_id": user.user_id,
            "role": user.role,
            "exp": int(expires_at.timestamp()),
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
        except jwt.InvalidTokenError:
            logger.warning("JWT token invalid")

        return None
