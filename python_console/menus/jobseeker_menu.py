from dto.application_dto import ApplicationDTO
from service.application_service import ApplicationService
from repository.job_repository import JobRepository
from service.profile_service import ProfileService
from dto.profile_dto import ProfileDTO
from dto.resume_dto import ResumeDTO
from service.resume_service import ResumeService

import re
from utils.constants import PHONE_NUMBER_LENGTH, ROLE_JOBSEEKER, VALID_JOB_SEARCH_FIELDS
from utils.decorators import require_role
from utils.logger import get_logger

logger = get_logger(__name__)


@require_role(ROLE_JOBSEEKER)
def jobseeker_menu(payload):
    user_id = payload.get("user_id")
    logger.info("Jobseeker menu opened: user_id=%s", user_id)
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
        logger.info("Jobseeker menu choice selected: user_id=%s choice=%s", user_id, choice)
        if choice == "1":
            # create profile
            try:
                qualification = input("Enter your qualification (like., B.Sc Computer Science): ").strip()
                if not re.fullmatch(r"[A-Za-z\s\.]+", qualification):
                    raise ValueError("Qualification must contain only letters and spaces.")
                
                exp_input = input("Enter years of experience (integer): ").strip()
                if not exp_input.isdigit():
                    raise ValueError("Experience must be an integer.")
                experience = int(exp_input)
              
                skills_input = input("Enter skills (comma separated): ").strip()
                skills = skills_input 
                
                profile_dto = ProfileDTO(qualification, experience, skills)
                service = ProfileService()
                service.create_profile(profile_dto, user_id)
                logger.info("Profile created from jobseeker menu: user_id=%s", user_id)
                print("Profile created successfully.")
            except Exception as e:
                logger.exception("Error creating profile: user_id=%s", user_id)
                print(f"Error creating profile: {e}")

        elif choice == "2":
            try:
                service = ProfileService()
                profile = service.get_profile(user_id)
                logger.info("Jobseeker viewed profile: user_id=%s found=%s", user_id, profile is not None)
                if not profile:
                    print("No profile found. Please create a profile first.")
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

                skills_input = input("Enter skills (comma separated): ").strip()
                skills = skills_input 
                
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
                logger.info("Jobseeker viewed resumes: user_id=%s count=%s", user_id, len(resumes))
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
                        logger.info("Job search returned no results: user_id=%s field=%s query=%s", user_id, field, query)
                        print("No matching jobs found.")
                    else:
                        logger.info("Job search completed: user_id=%s field=%s query=%s count=%s", user_id, field, query, len(filtered))
                        print(f"{'Job ID':<8} {'Title':<30} {'Location':<20} {'Salary':<10}")
                        for job in filtered:
                            print(f"{job.job_id:<8} {job.title:<30} {job.location:<20} {job.salary:<10}")
            except Exception as e:
                logger.exception("Error searching jobs: user_id=%s", user_id)
                print(f"Error searching jobs: {e}")
    
        elif choice == "6":
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
              
                job_id_input = input("Enter Job ID to apply: ").strip()
                if not job_id_input.isdigit():
                    raise ValueError("Job ID must be an integer.")
                job_id = int(job_id_input)
                job_ids = [job.job_id for job in jobs]
                if job_id not in job_ids:
                    raise ValueError("Job ID not found.")
                    
                # List resumes for selection
                resume_service = ResumeService(user_id)
                resumes = list(resume_service.list_resumes())
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
                # python lists using 0-based indexing

                
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
                logger.info("Jobseeker viewed applications: user_id=%s count=%s", user_id, len(apps))
                if not apps:
                    print("No applications found.")
                else:
                    print(f"{'Job Title':<30} {'Company':<20} {'Status':<12} {'Applied At':<20}")
                    for app in apps:
                        # hasattr(python-inbuilt method) checks whether object has an attribute
                        if hasattr(app.applied_at, "strftime"):
                            applied = app.applied_at.strftime("%Y-%m-%d %H:%M")
                        else:
                            applied = str(app.applied_at or "N/A")

                        company = app.company or "N/A"
                        print(f"{app.job_title[:30]:<30} {str(company):<20} {app.status:<12} {applied:<20}")
            except Exception as e:
                logger.exception("Error viewing applications: user_id=%s", user_id)
                print(f"Error viewing applications: {e}")
                
        elif choice == "8":
            logger.info("Jobseeker logged out: user_id=%s", user_id)
            print("Logged out successfully.")
            break
        else:
            logger.warning("Invalid jobseeker menu choice: user_id=%s choice=%s", user_id, choice)
            print("Invalid choice. Please try again.")
