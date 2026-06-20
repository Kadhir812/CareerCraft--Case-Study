class InvalidEmailException(Exception):
    pass


class UserAlreadyExistsException(Exception):
    pass


class InvalidRoleException(Exception):
    pass


class AuthenticationFailedException(Exception):
    pass


class JobNotFoundException(Exception):
    pass


class ApplicationNotFoundException(Exception):
    pass


class ProfileNotFoundException(Exception):
    pass


class UnauthorizedException(Exception):
    pass

class ApplicationStatusException(Exception):
    pass