from dto.application_dto import ApplicationDTO
from dto.applicant_dto import ApplicantDTO
from model.application import Application
from repository.application_repository import ApplicationRepository

class ApplicationService:
    def __init__(self):
        self.repo = ApplicationRepository()

    def apply(self, dto: ApplicationDTO) -> bool:
        
        if not dto.phone_number.isdigit() or len(dto.phone_number) != 10:
            raise ValueError("Phone number must be a 10‑digit numeric string")
    
        application = Application(
            application_id=None,
            job_id=dto.job_id,
            user_id=dto.user_id,
            resume_id=dto.resume_id,
            phone_number=dto.phone_number,
            status=dto.status,
        )
        self.repo.save(application)
        return True

    def get_applicants_by_job(self, job_id: int) -> list:
        """Return list of ApplicantDTO for the given job using repository."""
        rows = self.repo.find_by_job(job_id)
        applicants = []
        for row in rows:
            applicant = ApplicantDTO(
                application_id=row.get('application_id'),
                job_id=row.get('job_id'),
                job_title=row.get('job_title'),
                resume_id=row.get('resume_id'),
                qualification=row.get('qualification'),
                experience=row.get('experience'),
                skills=row.get('skills'),
                applicant_name=row.get('applicant_name'),
                phone_number=row.get('phone_number'),
                status=row.get('status'),
            )
            applicants.append(applicant)
        return applicants

    def update_status(self, application_id: int, new_status: str) -> bool:
        try:
            return self.repo.update_status(application_id, new_status)
        except Exception as e:
            print(f"Error updating application status: {e}")
            return False

    def get_user_applications(self, user_id: int) -> list:
        try:
            return self.repo.find_by_user(user_id)
        except Exception as e:
            print(f"Error retrieving user applications: {e}")
            return []
 