import mysql.connector
from utils.logger import get_logger

logger = get_logger(__name__)


def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="careercrafter"
        )
        return conn
    except mysql.connector.Error as e:
        logger.exception("Database connection failed")
        print(e)
        raise
