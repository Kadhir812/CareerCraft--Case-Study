from utils.db_connection import get_connection
from model.resume import Resume

class ResumeRepository:
    def save(self, resume: Resume):
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = """
                INSERT INTO resumes (user_id, resume_name, qualification, experience, skills)
                VALUES (%s, %s, %s, %s, %s)
            """
            values = (resume.user_id, resume.resume_name, resume.qualification,
                      resume.experience, resume.skills)
            cursor.execute(query, values)
            conn.commit()
            print("Resume saved successfully.")
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def find_by_user(self, user_id: int) -> list[Resume]:
        conn = None
        cursor = None
        resumes = []
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM resumes WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            for row in cursor.fetchall():
                resumes.append(Resume(**row))
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        return resumes
