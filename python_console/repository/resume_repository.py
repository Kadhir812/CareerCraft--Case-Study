from model.resume import Resume
from utils.db_context import db_cursor
from utils.logger import get_logger

logger = get_logger(__name__)

class ResumeRepository:
    def save(self, resume):
        try:
            query = """
                INSERT INTO resumes (user_id, resume_name, qualification, experience, skills)
                VALUES (%s, %s, %s, %s, %s)
            """
            values = (resume.user_id, resume.resume_name, resume.qualification,
                      resume.experience, resume.skills)
            with db_cursor(commit=True) as cursor:
                cursor.execute(query, values)
            logger.info("Resume saved: user_id=%s resume_name=%s", resume.user_id, resume.resume_name)
        except Exception:
            logger.exception("Error saving resume: user_id=%s resume_name=%s", resume.user_id, resume.resume_name)
            raise

    def find_by_user(self, user_id):
        resumes = []
        try:
            query = "SELECT * FROM resumes WHERE user_id = %s"
            with db_cursor(dictionary=True) as cursor:
                cursor.execute(query, (user_id,))
                for row in cursor.fetchall():
                    resumes.append(Resume(**row))
            logger.info("Resumes fetched by user: user_id=%s count=%s", user_id, len(resumes))
        except Exception:
            logger.exception("Error fetching resumes: user_id=%s", user_id)
            raise
        return resumes
