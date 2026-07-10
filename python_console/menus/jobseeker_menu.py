from dto.application_dto import ApplicationDTO
from service.application_service import ApplicationService
from repository.job_repository import JobRepository
from service.profile_service import ProfileService
from dto.profile_dto import ProfileDTO
from dto.resume_dto import ResumeDTO
from service.resume_service import ResumeService

import re
from utils.constants import PHONE_NUMBER_LENGTH, VALID_JOB_SEARCH_FIELDS
from utils.logger import get_logger

logger = get_logger(__name__)


def jobseeker_menu(payload):
    user_id = payload.get("user_id")
    while True:
        print("1. Create Profile")
        print("2. Show Profile")
        print("3. Upload Resume")
        print("4. Show Resumes")
        print("5. Search Jobs")
        print("6. Apply Job")
        print("7. View Applications")
        print("8. Logout")
        choice = input("Enter your choice: ").strip()
        if choice == "1":
            try:
                qualification = input("Enter your qualification (like., B.Sc Computer Science): ").strip()
                if not re.fullmatch(r"[A-Za-z\s\.]+", qualification):
                    raise ValueError("Qualification must contain only letters and spaces.")
                
                exp_input = input("Enter years of experience (integer): ").strip()
                if not exp_input.isdigit():
                    raise ValueError("Experience must be an integer.")
                experience = int(exp_input)
              
                skills = input("Enter skills (comma separated): ").strip()
                 
                profile_dto = ProfileDTO(qualification, experience, skills)
                service = ProfileService()
                service.create_profile(profile_dto, user_id)
                logger.info("Profile created: user_id=%s", user_id)
                print("Profile created successfully.")
            except Exception as e:
                logger.exception("Error creating profile: user_id=%s", user_id)
                print(f"Error creating profile: {e}")

        elif choice == "2":
            try:
                service = ProfileService()
                profile = service.get_profile(user_id)
                if not profile:
                    print("No profile found.")
                else:
                    print("\nYour Profile")
                    print(f"Qualification : {profile.qualification}")
                    print(f"Experience    : {profile.experience} years")
                    print(f"Skills        : {profile.skills}")
            except Exception as e:
                logger.exception("Error showing profile: user_id=%s", user_id)
                print(f"Error showing profile: {e}")

        elif choice == "3":
           
            try:
                resume_name = input("Resume Name: ").strip()
                qualification = input("Qualification: ").strip()
                
                exp_input = input("Experience (years): ").strip()
                if not exp_input.isdigit():
                    raise ValueError("Experience must be an integer.")
                
                experience = int(exp_input)

                skills = input("Enter skills (comma separated): ").strip()
              
                resume_dto = ResumeDTO(resume_name, qualification, experience, skills)
                resume_service = ResumeService(user_id)
                resume_service.upload_resume(resume_dto)
                logger.info("Resume uploaded from jobseeker menu: user_id=%s resume_name=%s", user_id, resume_name)
                print("Resume uploaded successfully.")
            except Exception as e:
                logger.exception("Error uploading resume: user_id=%s", user_id)
                print(f"Error uploading resume: {e}")

        elif choice == "4":
            try:
                resume_service = ResumeService(user_id)
                resumes = list(resume_service.list_resumes())
                if not resumes:
                    print("No resumes found.")
                else:
                    print("\nYour Resumes")
                    for idx, resume in enumerate(resumes, start=1):
                        print(f"\n{idx}. {resume.resume_name} (ID: {resume.resume_id})")
                        print(f"Qualification : {resume.qualification}")
                        print(f"Experience    : {resume.experience} years")
                        print(f"Skills        : {resume.skills}")
            except Exception as e:
                logger.exception("Error showing resumes: user_id=%s", user_id)
                print(f"Error showing resumes: {e}")

        elif choice == "5":
            try:
                repo = JobRepository()
                jobs = repo.find_all()
                if not jobs:
                    print("No jobs available.")
                else:
                    print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                    for job in jobs:
                        print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")

                    field = input(f"Search by ({'/'.join(VALID_JOB_SEARCH_FIELDS)}): ").strip().lower()
                    query = input(f"Enter {field} keyword: ").strip().lower()
                    if field not in VALID_JOB_SEARCH_FIELDS:
                        raise ValueError("Invalid search field")
                    def job_matches_search(job):
                        if field == "title":
                            selected_value = job.title.lower()
                        else:
                            selected_value = job.location.lower()
                        return query in selected_value

                    filtered = list(filter(job_matches_search, jobs))
                    filtered = sorted(filtered, key=lambda job: job.salary)
                    
                    if not filtered:
                        print("No matching jobs found.")
                    else:
                        print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                        for job in filtered:
                            print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")
            except Exception as e:
                logger.exception("Error searching jobs: user_id=%s", user_id)
                print(f"Error searching jobs: {e}")
    
        elif choice == "6":
            try:
                repo = JobRepository()
                jobs = repo.find_all()
                if not jobs:
                    print("No jobs available to apply for.")
                    continue
                print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                for job in jobs:
                    print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")
              
                job_id_input = input("Enter Job ID to apply: ").strip()
                if not job_id_input.isdigit():
                    raise ValueError("Job ID must be an integer.")
                job_id = int(job_id_input)
                job_ids = [job.job_id for job in jobs]
                if job_id not in job_ids:
                    raise ValueError("Job ID not found.")
                    
                resume_service = ResumeService(user_id)
                resumes = list(resume_service.list_resumes())
                if not resumes:
                    print("No resumes found. Please upload a resume first.")
                    continue
                print("Select a resume to apply with:")
                
                for res_num, r in enumerate(resumes, start=1):
                    print(f"{res_num}. {r.resume_name} (ID: {r.resume_id})")
                    
                sel = input("Enter number: ").strip()
                if not sel.isdigit() or int(sel) < 1 or int(sel) > len(resumes):
                    raise ValueError("Invalid selection.")
                chosen = resumes[int(sel) - 1]

                phone = input(f"Enter your {PHONE_NUMBER_LENGTH}-digit phone number: ").strip()
                if not phone.isdigit() or len(phone) != PHONE_NUMBER_LENGTH:
                    raise ValueError(f"Phone number must be a {PHONE_NUMBER_LENGTH}-digit numeric string.")

             
                dto = ApplicationDTO(job_id=job_id, resume_id=chosen.resume_id, phone_number=phone, user_id=user_id)
                app_service = ApplicationService()
                app_service.apply(dto)
                logger.info("Application submitted from jobseeker menu: user_id=%s job_id=%s resume_id=%s", user_id, job_id, chosen.resume_id)
                print("Application submitted successfully.")
            except Exception as e:
                logger.exception("Error applying for job: user_id=%s", user_id)
                print(f"Error during apply job: {e}")

        elif choice == "7":
            try:
                app_service = ApplicationService()
                apps = app_service.get_user_applications(user_id)
                if not apps:
                    print("No applications found.")
                else:
                    print(f"{'Job Title':<30} {'Company':<20} {'Status':<12} {'Applied At':<20}")
                    for app in apps:
                        applied = app.applied_at.strftime("%Y-%m-%d %H:%M")
                        company = app.company or "N/A"
                        print(f"{app.job_title[:30]:<30} {str(company):<20} {app.status:<12} {applied:<20}")
            except Exception as e:
                logger.exception("Error viewing applications: user_id=%s", user_id)
                print(f"Error viewing applications: {e}")
                
        elif choice == "8":
            print("Logged out successfully.")
            break
        else:
            print("Invalid choice. Please try again.")
