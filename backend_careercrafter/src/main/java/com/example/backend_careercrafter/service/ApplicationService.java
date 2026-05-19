
package com.example.backend_careercrafter.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.job_application.ApplicationRequestDTO;
import com.example.backend_careercrafter.dto.job_application.ApplicationResponseDTO;
import com.example.backend_careercrafter.dto.job_application.ApplicationStatusUpdateDTO;
import com.example.backend_careercrafter.dto.profile.JobSeekerProfileDTO;
import com.example.backend_careercrafter.dto.resume.ResumeDTO;
import com.example.backend_careercrafter.model.Application;
import com.example.backend_careercrafter.model.JobListing;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.NotificationType;
import com.example.backend_careercrafter.model.enums.Status;
import com.example.backend_careercrafter.model.resume.Resume;
import com.example.backend_careercrafter.repository.ApplicationRepository;
import com.example.backend_careercrafter.repository.EmployerRepository;
import com.example.backend_careercrafter.repository.JobListingRepository;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.ResumeRepository;
import com.example.backend_careercrafter.service.resume.S3ResumeStorageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobListingRepository jobListingRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmployerRepository employerRepository;
    private final NotificationService notificationService;
    private final ResumeRepository resumeRepository;
    private final S3ResumeStorageService s3ResumeStorageService;

    @Transactional
    public ApplicationResponseDTO applyToJob(String seekerEmail, ApplicationRequestDTO dto) {
        JobListing job = jobListingRepository.findById(dto.getJobId())
                .orElseThrow(() -> new EntityNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.ACTIVE)
            throw new IllegalStateException("Job is not active");
        JobSeeker seeker = jobSeekerRepository.findByUserEmail(seekerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Seeker not found for email: " + seekerEmail));
        Application app = new Application();
        app.setJob(job);
        app.setSeeker(seeker);
        app.setStatus(Status.APPLIED);
        app.setAppliedDate(LocalDateTime.now());
        app.setCoverLetter(dto.getCoverLetter());

        if (dto.getExperienceLevel() != null) {
            app.setExperienceLevel(dto.getExperienceLevel());
        } else {
            throw new IllegalArgumentException("Experience level is required");
        }
        app.setPortfolioUrl(dto.getPortfolioUrl());
        
        if (dto.getResumeId() != null) {
            Resume resume = resumeRepository.findById(dto.getResumeId())
                    .orElseThrow(() -> new EntityNotFoundException("Resume not found: " + dto.getResumeId()));
            if (resume.getJobSeeker().getId() != seeker.getId()) {
                throw new AccessDeniedException("Resume does not belong to this seeker");
            }
            app.setResume(resume);
        }
        try {
            app = applicationRepository.save(app);
        } catch (DataIntegrityViolationException e) {
            log.error("Duplicate application", e);
            throw new IllegalStateException("Already applied to this job");
        }
        notificationService.createNotification(
                job.getEmployer().getUser(),
                NotificationType.NEW_APPLICATION,
                getSeekerName(seeker) + " applied for " + job.getTitle() + ".",
                "/applicant/" + app.getId());
        return toResponseDTO(app);
    }

    public List<ApplicationResponseDTO> getMyApplications(String seekerEmail) {
        JobSeeker seeker = jobSeekerRepository.findByUserEmail(seekerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Seeker not found for email: " + seekerEmail));
        List<Application> apps = applicationRepository.findBySeekerId(seeker.getId());
        return apps.stream()
                    .map(this::toResponseDTO)
                    .collect(Collectors.toList());
    }

    public List<ApplicationResponseDTO> getApplicationsForJob(String employerEmail, Long jobId) {
        JobListing job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found"));

        var employer = employerRepository.findByUserEmail(employerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found"));

        if (job.getEmployer().getId() != employer.getId())
            throw new AccessDeniedException("Not your job listing");

        List<Application> apps = applicationRepository.findByJobId(jobId);

        return apps.stream()
                .map(this::toResponseDTOWithSeeker)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponseDTO updateApplicationStatus(String employerEmail, Long appId,
            ApplicationStatusUpdateDTO dto) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        JobListing job = app.getJob();
        // Find employer by email
        var employer = employerRepository.findByUserEmail(employerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found for email: " + employerEmail));
        if (job.getEmployer().getId() != employer.getId())
            throw new AccessDeniedException("Not your job listing");
        Status newStatus = dto.getStatus();
        app.setStatus(newStatus);
        applicationRepository.save(app);
        notificationService.createNotification(
                app.getSeeker().getUser(),
                NotificationType.APPLICATION_UPDATE,
                "Your application for " + job.getTitle() + " is now " + newStatus.name() + ".",
                "/application/" + app.getId());
        return toResponseDTO(app);
    }

    private ApplicationResponseDTO toResponseDTO(Application app) {
        return ApplicationResponseDTO.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getEmployer().getCompanyName())
                .status(app.getStatus().name())
                .appliedDate(app.getAppliedDate())
                .coverLetter(app.getCoverLetter())
                .experienceLevel(app.getExperienceLevel() != null ? app.getExperienceLevel().name() : null)
                .portfolioUrl(app.getPortfolioUrl())
                .resumeId(app.getResume() != null ? app.getResume().getId() : null)
                .build();
    }

    private ApplicationResponseDTO toResponseDTOWithSeeker(Application app) {
        ApplicationResponseDTO.ApplicationResponseDTOBuilder dtoBuilder = toResponseDTO(app).toBuilder();
        JobSeekerProfileDTO seekerProfile = JobSeekerProfileDTO.builder()
                .id(app.getSeeker().getId())
                .name(getSeekerName(app.getSeeker()))
                .email(getSeekerEmail(app.getSeeker()))
                .phone(app.getSeeker().getPhone())
                .location(app.getSeeker().getLocation())
                .headline(app.getSeeker().getHeadline())
                .build();
        dtoBuilder.seekerProfile(seekerProfile);
        Resume attachedResume = app.getResume();
        ResumeDTO resumeDTO = attachedResume != null
                ? ResumeDTO.builder()
                        .id(attachedResume.getId())
                        .url(s3ResumeStorageService.createPresignedUrl(attachedResume.getFileUrl()))
                        .build()
                : getDefaultResumeDTO(app.getSeeker());
        if (resumeDTO != null) {
            dtoBuilder.resume(resumeDTO);
        }
        return dtoBuilder.build();
    }

    public ApplicationResponseDTO getApplicationByIdForEmployer(String employerEmail, Long appId) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        JobListing job = app.getJob();
        var employer = employerRepository.findByUserEmail(employerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found for email: " + employerEmail));
        if (job.getEmployer().getId() != employer.getId())
            throw new AccessDeniedException("Not your job listing");
        return toResponseDTOWithSeeker(app);
    }

    // Helper to get default ResumeDTO for a JobSeeker
    private ResumeDTO getDefaultResumeDTO(JobSeeker seeker) {
        List<Resume> resumes = resumeRepository.findAllByJobSeeker(seeker);
        return resumes.stream()
                .filter(Resume::getIsDefault)
                .findFirst()
                .map(resume -> ResumeDTO.builder()
                        .id(resume.getId())
                        .url(s3ResumeStorageService.createPresignedUrl(resume.getFileUrl()))
                        .build())
                .orElse(null);
    }

    private String getSeekerName(JobSeeker seeker) {
        return ((seeker.getFirstName() != null ? seeker.getFirstName() : "") + " "
                + (seeker.getLastName() != null ? seeker.getLastName() : "")).trim();
    }

    private String getSeekerEmail(JobSeeker seeker) {
        return seeker.getUser() != null ? seeker.getUser().getEmail() : null;
    }

}
