import re

from exceptions.custom_exceptions import InvalidEmailException
from utils.logger import get_logger

logger = get_logger(__name__)


def validate_email(email):

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if not re.match(pattern, email):
        logger.warning("Email validation failed: email=%s", email)
        raise InvalidEmailException()

    logger.info("Email validated: email=%s", email)
    return True
