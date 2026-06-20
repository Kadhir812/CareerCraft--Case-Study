from dto.application_dto import ApplicationDTO
from service.application_service import ApplicationService
from repository.job_repository import JobRepository
from service.profile_service import ProfileService
from dto.profile_dto import ProfileDTO
from dto.resume_dto import ResumeDTO
from service.resume_service import ResumeService

import re
from repository.application_repository import ApplicationRepository


def jobseeker_menu(controller, payload):
    while True:
        print("1. Create Profile")
        print("2. Upload Resume")
        print("3. Search Jobs")
        print("4. Apply Job")
        print("5. View Applications")
        print("6. Logout")
        choice = input("Enter your choice: ").strip()
        if choice == "1":
            # Create Profile
            try:
                qualification = input("Enter your qualification (e.g., B.Sc Computer Science): ").strip()
                if not re.fullmatch(r"[A-Za-z\s\.]+", qualification):
                    raise ValueError("Qualification must contain only letters, spaces, and periods.")
                exp_input = input("Enter years of experience (integer): ").strip()
                if not exp_input.isdigit():
                    raise ValueError("Experience must be an integer.")
                    
                experience = int(exp_input)

                skills_input = input("Enter skills (comma separated): ").strip()
                skills = skills_input 
                
                profile_dto = ProfileDTO(qualification, experience, skills)
                service = ProfileService()
                service.create_profile(profile_dto, payload.get("user_id"))
                print("Profile created successfully.")
            except Exception as e:
                print(f"Error creating profile: {e}")

        elif choice == "2":
           
            try:
                resume_name = input("Resume Name: ").strip()
                qualification = input("Qualification: ").strip()
                exp_input = input("Experience (years): ").strip()
                if not exp_input.isdigit():
                    raise ValueError("Experience must be an integer.")
                
                experience = int(exp_input)

                skills_input = input("Enter skills (comma separated): ").strip()
                skills = skills_input 
                
                resume_dto = ResumeDTO(resume_name, qualification, experience, skills)
                resume_service = ResumeService(payload.get("user_id"))
                resume_service.upload_resume(resume_dto)
                print("Resume uploaded successfully.")
            except Exception as e:
                print(f"Error uploading resume: {e}")

        elif choice == "3":
            try:
                repo = JobRepository()
                jobs = repo.find_all()
                if not jobs:
                    print("No jobs available.")
                else:
                    field = input("Search by (title/location): ").strip().lower()
                    query = input(f"Enter {field} keyword: ").strip().lower()
                    if field not in ("title", "location"):
                        raise ValueError("Invalid search field")
                    # Used higher‑order function filter with lambda
                    filtered = list(filter(lambda j: query in getattr(j, field).lower(), jobs))
                    if not filtered:
                        print("No matching jobs found.")
                    else:
                        print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                        for job in filtered:
                            print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")
            except Exception as e:
                print(f"Error searching jobs: {e}")
    
        elif choice == "4":
            try:
                # Fetch and display all available jobs
                repo = JobRepository()
                jobs = repo.find_all()
                if not jobs:
                    print("No jobs available to apply for.")
                    continue
                print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                for job in jobs:
                    print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")
                # Prompt for job ID to apply
                job_id_input = input("Enter Job ID to apply: ").strip()
                if not job_id_input.isdigit():
                    raise ValueError("Job ID must be an integer.")
                job_id = int(job_id_input)
                job_ids = [job.job_id for job in jobs]
                if job_id not in job_ids:
                    raise ValueError("Job ID not found.")
                    
                # List resumes for selection
                resume_service = ResumeService(payload.get("user_id"))
                resumes = resume_service.list_resumes()
                if not resumes:
                    print("No resumes found. Please upload a resume first.")
                    continue
                print("Select a resume to apply with:")
                for idx, r in enumerate(resumes, start=1):
                    print(f"{idx}. {r.resume_name} (ID: {r.resume_id})")
                sel = input("Enter number: ").strip()
                if not sel.isdigit() or int(sel) < 1 or int(sel) > len(resumes):
                    raise ValueError("Invalid selection.")
                chosen = resumes[int(sel) - 1]

                
                phone = input("Enter your 10‑digit phone number: ").strip()
                if not phone.isdigit() or len(phone) != 10:
                    raise ValueError("Phone number must be a 10‑digit numeric string.")

             
                dto = ApplicationDTO(job_id=job_id, resume_id=chosen.resume_id, phone_number=phone, user_id=payload.get("user_id"))
                app_service = ApplicationService()
                app_service.apply(dto)
                print("Application submitted successfully.")
            except Exception as e:
                print(f"Error during apply job: {e}")

        elif choice == "5":
            try:
                app_service = ApplicationService()
                apps = app_service.get_user_applications(payload.get("user_id"))
                if not apps:
                    print("No applications found.")
                else:
                    print(f"{'Job Title':<30} {'Company':<20} {'Status':<12} {'Applied At':<20}")
                    for app in apps:
                        applied = app["applied_at"].strftime("%Y-%m-%d %H:%M") if hasattr(app["applied_at"], "strftime") else str(app["applied_at"]) 
                        print(f"{app['job_title'][:30]:<30} {str(app['company']):<20} {app['status']:<12} {applied:<20}")
            except Exception as e:
                print(f"Error viewing applications: {e}")
        elif choice == "6":
            print("Logged out successfully.")
            from menus.menu import main_menu
            main_menu()
            break
        else:
            print("Invalid choice. Please try again.")