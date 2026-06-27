from functools import wraps

from utils.logger import get_logger

logger = get_logger(__name__)


def require_role(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(payload):
            if not payload:
                logger.warning("Access denied: user is not logged in")
                print("Access denied. Please login first.")
                return None

            user_role = payload.get("role")

            if user_role != required_role:
                logger.warning(
                    "Access denied: user_id=%s required_role=%s actual_role=%s",
                    payload.get("user_id"),
                    required_role,
                    user_role,
                )
                print("Access denied. You are not authorized.")
                return None

            logger.info(
                "Access granted: user_id=%s role=%s function=%s",
                payload.get("user_id"),
                user_role,
                func.__name__,
            )

            return func(payload)

        return wrapper

    return decorator
