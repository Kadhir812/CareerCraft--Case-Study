from service.application_service import ApplicationService
from service.job_service import JobService
from dto.job_dto import JobDTO
from utils.constants import APPLICATION_STATUS_BY_INPUT, ROLE_EMPLOYER
from utils.decorators import require_role
from utils.logger import get_logger

logger = get_logger(__name__)


@require_role(ROLE_EMPLOYER)
def employer_menu(payload):
    user_id = payload.get("user_id")
    logger.info("Employer menu opened: user_id=%s", user_id)
    while True:
        print("\n--- Employer Menu ---")
        print("1. Post a job")
        print("2. View my jobs")
        print("3. View applications for my jobs")
        print("4. Update Application Status")
        print("5. Logout")

        choice = input("Enter your choice: ").strip()
        logger.info("Employer menu choice selected: user_id=%s choice=%s", user_id, choice)

        if choice == '1':
            try:
                title = input("Job Title: ").strip()
                description = input("Description: ").strip()
                location = input("Location: ").strip()
                salary_input = input("Salary: ").strip()
                salary = float(salary_input) if salary_input else 0.0
                skills_input = input("Required Skills (comma separated): ").strip()
                
                job_dto = JobDTO(title, description, location, salary, skills_input)
                job_service = JobService(user_id)
                job_service.post_job(job_dto)
                logger.info("Employer posted job: user_id=%s title=%s location=%s", user_id, title, location)
                print("Job posted successfully.")
            except Exception as e:
                logger.exception("Error posting job: user_id=%s", user_id)
                print(f"Error posting job: {e}")
        
        elif choice == '2':
            try:
                job_service = JobService(user_id)
                jobs = list(job_service.get_my_jobs())
                logger.info("Employer viewed jobs: user_id=%s count=%s", user_id, len(jobs))
                if not jobs:
                    print("You have not posted any jobs yet.")
                else:
                    print(f"{'Job ID':<8} {'Title':<30} {'Description':<40} {'Location':<20} {'Salary':<10}")
                    for job in jobs:
                        print(f"{job.job_id:<8} {job.title:<30} {job.description:<40} {job.location:<20} {job.salary:<10}")
            except Exception as e:
                logger.exception("Error retrieving employer jobs: user_id=%s", user_id)
                print(f"Error retrieving jobs: {e}")
                
        elif choice == '3':
            try:
                # Retrieve employer's posted jobs
                job_service = JobService(user_id)
                jobs = list(job_service.get_my_jobs())
                if not jobs:
                    print("You have not posted any jobs yet.")
                else:
                    app_service = ApplicationService()
                    total_applicants = 0
                    for job in jobs:
                        applicants = app_service.get_applicants_by_job(job.job_id)
                        total_applicants += len(applicants)
                        if not applicants:
                            continue
                        print(f"\nApplicants for Job ID {job.job_id} - {job.title}:")
                        print(f"{'Application ID':<15} {'Job Title':<30} {'Resume ID':<10} {'Qualification':<50} {'Experience':<10} {'Skills':<20} {'Applicant':<20} {'Phone':<12} {'Status':<12}")
                        for app in applicants:
                            print(f"{app.application_id:<15} {app.job_title[:30]:<30} {app.resume_id:<10} {app.qualification[:50]:<50} {app.experience:<10} {app.skills[:20]:<20} {app.applicant_name[:20]:<20} {app.phone_number:<12} {app.status:<12}")
                    logger.info("Employer viewed applicants: user_id=%s jobs=%s applicants=%s", user_id, len(jobs), total_applicants)
            except Exception as e:
                logger.exception("Error viewing applicants: user_id=%s", user_id)
                print(f"Error viewing applicants: {e}")

        elif choice == '4':
            try:
                app_id_input = input("Application ID to update: ").strip()
                app_id = int(app_id_input)
                new_status_input = input(f"New status ({', '.join(APPLICATION_STATUS_BY_INPUT.values())}): ").strip().lower()
                if new_status_input not in APPLICATION_STATUS_BY_INPUT:
                    print(f"Invalid status. Allowed statuses: {', '.join(APPLICATION_STATUS_BY_INPUT.values())}")
                else:
                    new_status = APPLICATION_STATUS_BY_INPUT[new_status_input]
                    app_service = ApplicationService()
                    success = app_service.update_status(app_id, new_status)
                    if success:
                        logger.info("Application status updated from employer menu: user_id=%s application_id=%s status=%s", user_id, app_id, new_status)
                        print("Application status updated successfully.")
                    else:
                        logger.warning("Application status update failed: user_id=%s application_id=%s status=%s", user_id, app_id, new_status)
                        print("Failed to update application status.")
            except ValueError:
                logger.warning("Invalid application status update input: user_id=%s input=%s", user_id, app_id_input)
                print("Invalid input. Application ID must be an integer.")
            except Exception as e:
                logger.exception("Error updating application status from employer menu: user_id=%s", user_id)
                print(f"Error updating application status: {e}")


        elif choice == '5':
            logger.info("Employer logged out: user_id=%s", user_id)
            print("Logged out successfully.")
            break
        else:
            logger.warning("Invalid employer menu choice: user_id=%s choice=%s", user_id, choice)
            print("Invalid choice. Please try again.")
