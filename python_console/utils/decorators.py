from functools import wraps


def require_role(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            payload = kwargs.pop("payload", None)

            if not payload:
                print("Access denied. Please login first.")
                return None

            user_role = payload.get("role")

            if user_role != required_role:
                print("Access denied. You are not authorized.")
                return None

            return func(*args, **kwargs)

        return wrapper

    return decorator
