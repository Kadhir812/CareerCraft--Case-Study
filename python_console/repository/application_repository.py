from model.application import Application
from utils.db_context import db_cursor
from utils.logger import get_logger

logger = get_logger(__name__)


class ApplicationRepository:
    def save(self, application):
        sql = """
        INSERT INTO applications (
            job_id,
            user_id,
            resume_id,
            phone_number,
            status
        ) VALUES (%s, %s, %s, %s, %s)
        """
        params = (
            application.job_id,
            application.user_id,
            application.resume_id,
            application.phone_number,
            application.status,
        )
        with db_cursor(commit=True) as cursor:
            cursor.execute(sql, params)
        logger.info("Application saved: user_id=%s job_id=%s resume_id=%s", application.user_id, application.job_id, application.resume_id)

    def find_by_user(self, user_id):
        sql = """
        SELECT a.job_id,
               j.title,
               COALESCE(employer.company_name, employer.name) AS company,
               a.status,
               a.applied_at
        FROM applications a
        JOIN jobs j ON a.job_id = j.job_id
        JOIN users employer ON j.employer_id = employer.user_id
        WHERE a.user_id = %s
        ORDER BY a.applied_at DESC
        """
        with db_cursor() as cursor:
            cursor.execute(sql, (user_id,))
            rows = cursor.fetchall()
        logger.info("Applications fetched by user: user_id=%s count=%s", user_id, len(rows))
        
        result = []
        for job_id, title, company, status, applied_at in rows:
            result.append({
                "job_id": job_id,
                "job_title": title,
                "company": company,
                "status": status,
                "applied_at": applied_at,
            })
        return result

    def update_status(self, application_id, new_status):

        sql = """
        UPDATE applications
        SET status = %s
        WHERE application_id = %s
        """
        try:
            with db_cursor(commit=True) as cursor:
                cursor.execute(sql, (new_status, application_id))
                affected = cursor.rowcount
            if affected == 0:
                from exceptions.custom_exceptions import ApplicationNotFoundException
                logger.warning("Application status update found no rows: application_id=%s status=%s", application_id, new_status)
                raise ApplicationNotFoundException(f"Application ID {application_id} not found.")
            logger.info("Application status updated: application_id=%s status=%s", application_id, new_status)
            return True
        except Exception as db_err:
            logger.exception("Database error updating application status: application_id=%s status=%s", application_id, new_status)
            print(f"Database error updating status: {db_err}")
            return False

    def find_by_job(self, job_id):
        sql = """
        SELECT a.application_id,
               a.job_id,
               j.title           AS job_title,
               a.resume_id,
               r.qualification,
               r.experience,
               r.skills,
               u.name            AS applicant_name,
               a.phone_number,
               a.status
        FROM applications a
        JOIN jobs j ON a.job_id = j.job_id
        JOIN resumes r ON a.resume_id = r.resume_id
        JOIN users u ON a.user_id = u.user_id
        WHERE a.job_id = %s
        ORDER BY a.application_id
        """
        with db_cursor(dictionary=True) as cursor:
            cursor.execute(sql, (job_id,))
            rows = cursor.fetchall()
        logger.info("Applications fetched by job: job_id=%s count=%s", job_id, len(rows))
        return rows
