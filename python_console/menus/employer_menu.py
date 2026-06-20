from service.application_service import ApplicationService
from repository.application_repository import ApplicationRepository  # kept for potential other uses
from exceptions.custom_exceptions import ApplicationStatusException
from service.job_service import JobService
from dto.job_dto import JobDTO


print("welcome to employer menu")

def employer_menu(controller, payload):
    while True:
        print("\n--- Employer Menu ---")
        print("1. Post a job")
        print("2. View my jobs")
        print("3. View applications for my jobs")
        print("4. Update Application Status")
        print("5. Logout")

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
                job_service = JobService(payload.get("user_id"))  
                job_service.post_job(job_dto)
                print("Job posted successfully.")
            except Exception as e:
                print(f"Error posting job: {e}")
        
        elif choice == '2':
            try:
                job_service = JobService(payload.get("user_id"))
                jobs = list(job_service.get_my_jobs())
                if not jobs:
                    print("You have not posted any jobs yet.")
                else:
                    print(f"{'Job ID':<8} {'Title':<30} {'Description':<40} {'Location':<20} {'Salary':<10}")
                    for job in jobs:
                        print(f"{job.job_id:<8} {job.title:<30} {job.description:<40} {job.location:<20} {job.salary:<10}")
            except Exception as e:
                print(f"Error retrieving jobs: {e}")
                
        elif choice == '3':
            try:
                # Retrieve employer's posted jobs
                job_service = JobService(payload.get("user_id"))
                jobs = list(job_service.get_my_jobs())
                if not jobs:
                    print("You have not posted any jobs yet.")
                else:
                    app_service = ApplicationService()
                    for job in jobs:
                        applicants = app_service.get_applicants_by_job(job.job_id)
                        if not applicants:
                            continue
                        print(f"\nApplicants for Job ID {job.job_id} - {job.title}:")
                        print(f"{'Job Title':<30} {'Resume ID':<10} {'Qualification':<15} {'Experience':<10} {'Skills':<20} {'Applicant':<20} {'Phone':<12} {'Status':<12}")
                        for app in applicants:
                            print(f"{app.job_title[:30]:<30} {app.resume_id:<10} {app.qualification[:50]:<50} {app.experience:<10} {app.skills[:20]:<20} {app.applicant_name[:20]:<20} {app.phone_number:<12} {app.status:<12}")
            except Exception as e:
                print(f"Error viewing applicants: {e}")

        elif choice == '4':
            try:
                app_id_input = input("Application ID to update: ").strip()
                app_id = int(app_id_input)
                new_status_input = input("New status (Applied, Shortlisted, Rejected, Selected): ").strip().lower()
                status_map = {
                    'applied': 'Applied',
                    'shortlisted': 'Shortlisted',
                    'rejected': 'Rejected',
                    'selected': 'Selected'
                }
                if new_status_input not in status_map:
                    print(f"Invalid status. Allowed statuses: {', '.join(status_map.values())}")
                else:
                    new_status = status_map[new_status_input]
                    app_service = ApplicationService()
                    success = app_service.update_status(app_id, new_status)
                    if success:
                        print("Application status updated successfully.")
                    else:
                        print("Failed to update application status.")
            except ValueError:
                print("Invalid input. Application ID must be an integer.")
            except Exception as e:
                print(f"Error updating application status: {e}")


        elif choice == '5':
            print("Logged out successfully.")
            from menus.menu import main_menu
            main_menu()
            break
        else:
            print("Invalid choice. Please try again.")