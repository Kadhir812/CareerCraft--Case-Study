from model.job import Job
from utils.db_context import db_cursor
from utils.logger import get_logger

logger = get_logger(__name__)

class JobRepository:
    def save(self, job: Job) -> None:
        sql = """
        INSERT INTO jobs (employer_id, title, description, location, salary, required_skills)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (job.employer_id, job.title, job.description,
                  job.location, job.salary, job.required_skills)
        with db_cursor(commit=True) as cursor:
            cursor.execute(sql, params)
        logger.info("Job saved: employer_id=%s title=%s", job.employer_id, job.title)

    def find_by_employer(self, employer_id: int) -> list[Job]:
        sql = "SELECT job_id, employer_id, title, description, location, salary, required_skills FROM jobs WHERE employer_id = %s"
        with db_cursor() as cursor:
            cursor.execute(sql, (employer_id,))
            rows = cursor.fetchall()
        logger.info("Jobs fetched by employer: employer_id=%s count=%s", employer_id, len(rows))
        return [Job(
            job_id=row[0],
            employer_id=row[1],
            title=row[2],
            description=row[3],
            location=row[4],
            salary=row[5],
            required_skills=row[6]
        ) for row in rows]

    def find_all(self) -> list[Job]:
        """Return all job postings as Job model objects."""
        sql = "SELECT job_id, employer_id, title, description, location, salary, required_skills FROM jobs"
        with db_cursor() as cursor:
            cursor.execute(sql)
            rows = cursor.fetchall()
        logger.info("All jobs fetched: count=%s", len(rows))
        return [Job(
            job_id=row[0],
            employer_id=row[1],
            title=row[2],
            description=row[3],
            location=row[4],
            salary=row[5],
            required_skills=row[6],
        ) for row in rows]
