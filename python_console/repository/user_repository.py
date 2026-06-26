from mysql.connector import IntegrityError

from exceptions.custom_exceptions import UserAlreadyExistsException
from utils.db_context import db_cursor
from utils.logger import get_logger
from model.user import User

logger = get_logger(__name__)


class UserRepository:

    def save(self, user):
        try:
            query = """
            INSERT INTO users(name,email,password,role,company_name)
            VALUES(%s,%s,%s,%s,%s)
            """
            
            values = (
                user.name,
                user.email,
                user.password,
                user.role,
                user.company_name
            )

            # cursor is an object which sends sql commands to db and recieves data
            with db_cursor(commit=True) as cursor: 
                cursor.execute(query, values)
                user.user_id = cursor.lastrowid
            logger.info("User saved: user_id=%s role=%s", user.user_id, user.role)
            return user

        except IntegrityError:
            logger.exception("Integrity error while saving user: email=%s", user.email)
            raise UserAlreadyExistsException()

    def find_by_email(self, email):
        query = "SELECT * FROM users WHERE email = %s"
        with db_cursor(dictionary=True) as cursor:
            cursor.execute(query, (email,))
            result = cursor.fetchone()
        if result:
            logger.info("User found by email: user_id=%s email=%s", result['user_id'], email)
            return User(
                # mapping a database row to a model object.
                result['user_id'],
                result['name'],
                result['email'],
                result['password'],
                result['role'],
                result.get('company_name')
            )
        logger.info("No user found by email: email=%s", email)
        return None


