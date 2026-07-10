from service.application_service import ApplicationService
from service.job_service import JobService
from dto.job_dto import JobDTO
from utils.constants import APPLICATION_STATUS_BY_INPUT
from utils.logger import get_logger

logger = get_logger(__name__)


def employer_menu(payload):
    user_id = payload.get("user_id")
    while True:
        print("\n--- Employer Menu ---")
        print("1. Post a job")
        print("2. View my jobs")
        print("3. View applications for my jobs")
        print("4. Update Application Status")
        print("5. Delete job by ID")
        print("6. Logout")

        choice = input("Enter your choice: ").strip()

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
                        print(f"{'App ID':<8} {'Resume ID':<10} {'Qualification':<20} {'Experience':<10} {'Skills':<20} {'Applicant':<15} {'Phone':<12} {'Status':<10}")
                        for app in applicants:
                            print(f"{app.application_id:<8} {app.resume_id:<10} {app.qualification[:20]:<20} {app.experience:<10} {app.skills[:20]:<20} {app.applicant_name[:15]:<15} {app.phone_number:<12} {app.status:<10}")
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
                print("Invalid input. Application ID must be an integer.")
            except Exception as e:
                logger.exception("Error updating application status from employer menu: user_id=%s", user_id)
                print(f"Error updating application status: {e}")


        elif choice == '5':
            job_id_input = ""
            try:
                job_id_input = input("Job ID to delete: ").strip()
                job_id = int(job_id_input)
                job_service = JobService(user_id)
                deleted = job_service.delete_job(job_id, payload=payload)
                if deleted:
                    print("Job deleted successfully.")
                else:
                    print("Job not found.")
            except ValueError:
                print("Invalid input. Job ID must be an integer.")
            except Exception as e:
                logger.exception("Error deleting job from employer menu: user_id=%s", user_id)
                print(f"Error deleting job: {e}")

        elif choice == '6':
            print("Logged out successfully.")
            break
        else:
            print("Invalid choice. Please try again.")
