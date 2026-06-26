from utils.logger import get_logger

logger = get_logger(__name__)


def require_role(required_role: str):
    def decorator(func):
        def wrapper(payload, *args, **kwargs):
            if not payload:
                print("Access denied. Please login first.")
                logger.warning("Access denied because payload is missing")
                return None

            user_role = payload.get("role")
            if user_role != required_role:
                print("Access denied. You are not authorized for this menu.")
                logger.warning("Access denied for user_id=%s", payload.get("user_id"))
                return None

            return func(payload, *args, **kwargs)

        return wrapper

    return decorator
