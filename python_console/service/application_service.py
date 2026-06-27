from dto.application_dto import ApplicationDTO
from dto.applicant_dto import ApplicantDTO
from dto.user_application_dto import UserApplicationDTO
from exceptions.custom_exceptions import InvalidApplicationException
from model.application import Application
from repository.application_repository import ApplicationRepository
from utils.constants import PHONE_NUMBER_LENGTH
from utils.logger import get_logger

logger = get_logger(__name__)

class ApplicationService:
    def __init__(self):
        self.repo = ApplicationRepository()

    def apply(self, dto):
        
        if not dto.phone_number.isdigit() or len(dto.phone_number) != PHONE_NUMBER_LENGTH:
            logger.warning("Application validation failed: user_id=%s job_id=%s reason=invalid_phone", dto.user_id, dto.job_id)
            raise InvalidApplicationException()
    
        logger.info("Submitting application: user_id=%s job_id=%s resume_id=%s", dto.user_id, dto.job_id, dto.resume_id)
        application = Application(
            application_id=None,
            job_id=dto.job_id,
            user_id=dto.user_id,
            resume_id=dto.resume_id,
            phone_number=dto.phone_number,
            status=dto.status,
        )
        self.repo.save(application)
        logger.info("Application submitted: user_id=%s job_id=%s resume_id=%s", dto.user_id, dto.job_id, dto.resume_id)
        return True

    def get_applicants_by_job(self, job_id):
        rows = self.repo.find_by_job(job_id)
        logger.info("Fetched applicants by job: job_id=%s count=%s", job_id, len(rows))
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

    def update_status(self, application_id, new_status):
        try:
            success = self.repo.update_status(application_id, new_status)
            logger.info("Application status update requested: application_id=%s status=%s success=%s", application_id, new_status, success)
            return success
        except Exception as e:
            logger.exception("Error updating application status: application_id=%s status=%s", application_id, new_status)
            print(f"Error updating application status: {e}")
            return False

    def get_user_applications(self, user_id):
        try:
            rows = self.repo.find_by_user(user_id)
            applications = [
                UserApplicationDTO(
                    job_id=row.get("job_id"),
                    job_title=row.get("job_title"),
                    company=row.get("company"),
                    status=row.get("status"),
                    applied_at=row.get("applied_at"),
                )
                for row in rows
            ]
            logger.info("Fetched user applications: user_id=%s count=%s", user_id, len(applications))
            return applications
        except Exception as e:
            logger.exception("Error retrieving user applications: user_id=%s", user_id)
            print(f"Error retrieving user applications: {e}")
            return []
 
