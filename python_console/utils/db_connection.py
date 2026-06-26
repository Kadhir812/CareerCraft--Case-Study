import mysql.connector
from utils.logger import get_logger

logger = get_logger(__name__)


def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Immunoglobin@812",
            database="careercrafter"
        )
        logger.info("Database connection opened with primary credentials")
        return conn
    except mysql.connector.Error:
        logger.warning("Primary database credentials failed; trying fallback credentials")
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="careercrafter"
        )
        logger.info("Database connection opened with fallback credentials")
        return conn
