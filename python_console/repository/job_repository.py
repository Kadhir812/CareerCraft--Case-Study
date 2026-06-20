from utils.db_connection import get_connection
from model.job import Job

class JobRepository:
    def __init__(self):
        self.conn = get_connection()

    def save(self, job: Job) -> None:
        sql = """
        INSERT INTO jobs (employer_id, title, description, location, salary, required_skills)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (job.employer_id, job.title, job.description,
                  job.location, job.salary, job.required_skills)
        with self.conn.cursor() as cursor:
            cursor.execute(sql, params)
        self.conn.commit()

    def find_by_employer(self, employer_id: int) -> list[Job]:
        sql = "SELECT job_id, employer_id, title, description, location, salary, required_skills FROM jobs WHERE employer_id = %s"
        with self.conn.cursor() as cursor:
            cursor.execute(sql, (employer_id,))
            rows = cursor.fetchall()
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
        with self.conn.cursor() as cursor:
            cursor.execute(sql)
            rows = cursor.fetchall()
        return [Job(
            job_id=row[0],
            employer_id=row[1],
            title=row[2],
            description=row[3],
            location=row[4],
            salary=row[5],
            required_skills=row[6],
        ) for row in rows]
