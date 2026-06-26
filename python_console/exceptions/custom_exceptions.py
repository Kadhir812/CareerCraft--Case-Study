class CareerCraftException(Exception):
    def __init__(self, message="CareerCraft application error"):
        super().__init__(message)


class InvalidEmailException(CareerCraftException):
    def __init__(self, message="Invalid email format"):
        super().__init__(message)


class UserAlreadyExistsException(CareerCraftException):
    def __init__(self, message="User already exists"):
        super().__init__(message)


class InvalidRoleException(CareerCraftException):
    def __init__(self, message="Invalid user role"):
        super().__init__(message)


class CompanyNameRequiredException(CareerCraftException):
    def __init__(self, message="Company name is required for employers"):
        super().__init__(message)


class AuthenticationFailedException(CareerCraftException):
    def __init__(self, message="Authentication failed"):
        super().__init__(message)


class JobNotFoundException(CareerCraftException):
    def __init__(self, message="Job not found"):
        super().__init__(message)


class ApplicationNotFoundException(CareerCraftException):
    def __init__(self, message="Application not found"):
        super().__init__(message)


class ProfileNotFoundException(CareerCraftException):
    def __init__(self, message="Profile not found"):
        super().__init__(message)


class UnauthorizedException(CareerCraftException):
    def __init__(self, message="Unauthorized access"):
        super().__init__(message)


class ApplicationStatusException(CareerCraftException):
    def __init__(self, message="Invalid application status"):
        super().__init__(message)


class InvalidApplicationException(CareerCraftException):
    def __init__(self, message="Invalid application details"):
        super().__init__(message)


class InvalidJobException(CareerCraftException):
    def __init__(self, message="Invalid job details"):
        super().__init__(message)


class InvalidProfileException(CareerCraftException):
    def __init__(self, message="Invalid profile details"):
        super().__init__(message)


class InvalidResumeException(CareerCraftException):
    def __init__(self, message="Invalid resume details"):
        super().__init__(message)

