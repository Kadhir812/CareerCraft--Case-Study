import mysql.connector


def get_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="Immunoglobin@812",
            database="careercrafter"
        )
    except mysql.connector.Error:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="careercrafter"
        )