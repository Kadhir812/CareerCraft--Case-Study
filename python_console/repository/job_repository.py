from model.job import Job
from utils.db_context import db_cursor
from utils.logger import get_logger

logger = get_logger(__name__)

class JobRepository:
    def save(self, job):
        sql = """
        INSERT INTO jobs (employer_id, title, description, location, salary, required_skills)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (job.employer_id, job.title, job.description,
                  job.location, job.salary, job.required_skills)
        with db_cursor(commit=True) as cursor:
            cursor.execute(sql, params)
        logger.info("Job saved: employer_id=%s title=%s", job.employer_id, job.title)

    def find_by_employer(self, employer_id):
        sql = """
        SELECT job_id, employer_id, title, description,
            location, salary, required_skills
        FROM jobs
        WHERE employer_id = %s
        """

        with db_cursor(dictionary=True) as cursor:
            cursor.execute(sql, (employer_id,))
            rows = cursor.fetchall()

        return [
            Job(
            job_id=row["job_id"],
            employer_id=row["employer_id"],
            title=row["title"],
            description=row["description"],
            location=row["location"],
            salary=row["salary"],
            required_skills=row["required_skills"],
            ) 
            for row in rows
        ]

    def find_all(self):
        sql = "SELECT job_id, employer_id, title, description, location, salary, required_skills FROM jobs"
        with db_cursor(dictionary=True) as cursor:
            cursor.execute(sql)
            rows = cursor.fetchall()
        return [
            Job(
                job_id=row["job_id"],
                employer_id=row["employer_id"],
                title=row["title"],
                description=row["description"],
                location=row["location"],
                salary=row["salary"],
                required_skills=row["required_skills"],
            )
            for row in rows
        ]

    def delete_by_id_for_employer(self, job_id, employer_id):
        delete_applications_sql = """
        DELETE FROM applications
        WHERE job_id = %s
          AND EXISTS (
              SELECT 1
              FROM jobs
              WHERE jobs.job_id = %s
                AND jobs.employer_id = %s
          )
        """
        delete_job_sql = "DELETE FROM jobs WHERE job_id = %s AND employer_id = %s"

        with db_cursor(commit=True) as cursor:
            cursor.execute(delete_applications_sql, (job_id, job_id, employer_id))
            deleted_applications = cursor.rowcount
            cursor.execute(delete_job_sql, (job_id, employer_id))
            deleted_jobs = cursor.rowcount

        logger.info(
            "Job delete requested: employer_id=%s job_id=%s deleted_jobs=%s deleted_applications=%s",
            employer_id,
            job_id,
            deleted_jobs,
            deleted_applications,
        )
        return deleted_jobs > 0
