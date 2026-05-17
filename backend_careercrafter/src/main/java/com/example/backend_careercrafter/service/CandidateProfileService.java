package com.example.backend_careercrafter.service;


import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend_careercrafter.dto.profile.CandidateProfileResponse;
import com.example.backend_careercrafter.dto.profile.JobSeekerProfileDTO;
import com.example.backend_careercrafter.dto.resume.EducationResponse;
import com.example.backend_careercrafter.dto.resume.ResumeResponse;
import com.example.backend_careercrafter.dto.resume.SkillResponse;
import com.example.backend_careercrafter.dto.resume.WorkExperienceResponse;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.Resume;
import com.example.backend_careercrafter.repository.ApplicationRepository;
import com.example.backend_careercrafter.repository.EmployerRepository;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.EducationRepository;
import com.example.backend_careercrafter.repository.resume.ResumeRepository;
import com.example.backend_careercrafter.repository.resume.SeekerSkillRepository;
import com.example.backend_careercrafter.repository.resume.WorkExperienceRepository;
import com.example.backend_careercrafter.service.resume.S3ResumeStorageService;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {
        private final JobSeekerRepository jobSeekerRepository;
        private final EmployerRepository employerRepository;
        private final ApplicationRepository applicationRepository;
        private final SeekerSkillRepository seekerSkillRepository;
        private final WorkExperienceRepository workExperienceRepository;
        private final EducationRepository educationRepository;
        private final ResumeRepository resumeRepository;
        private final S3ResumeStorageService s3ResumeStorageService;

        @Transactional(readOnly = true)
        public CandidateProfileResponse getCandidateProfile(String employerEmail, Long seekerId) {
                var employer = employerRepository.findByUserEmail(employerEmail)
                                .orElseThrow(() -> new EntityNotFoundException("Employer not found"));
                JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                                .orElseThrow(() -> new EntityNotFoundException("Candidate not found"));

                boolean hasApplicationForEmployer = applicationRepository
                                .existsBySeekerIdAndJobEmployerId(seekerId, employer.getId());

                if (!hasApplicationForEmployer) {
                        throw new AccessDeniedException("Candidate has not applied to your job listing");
                }

                List<SkillResponse> skills = seekerSkillRepository.findByJobSeeker(seeker).stream()
                                .map(seekerSkill -> new SkillResponse(
                                                seekerSkill.getId(),
                                                seekerSkill.getSkill().getSkillName()))
                                .toList();

                List<WorkExperienceResponse> workExperience = workExperienceRepository.findByJobSeeker(seeker).stream()
                                .map(work -> new WorkExperienceResponse(
                                                work.getId(),
                                                work.getCompany(),
                                                work.getPosition(),
                                                work.getStartDate() != null ? work.getStartDate().toString() : null,
                                                work.getEndDate() != null ? work.getEndDate().toString() : null,
                                                work.getLocation(),
                                                work.getDescription()))
                                .toList();

                List<EducationResponse> education = educationRepository.findByJobSeeker(seeker).stream()
                                .map(edu -> new EducationResponse(
                                                edu.getId(),
                                                edu.getInstitution(),
                                                edu.getDegree(),
                                                edu.getFieldOfStudy(),
                                                edu.getDescription(),
                                                edu.getGraduationDate() != null ? edu.getGraduationDate().toString()
                                                                : null,
                                                edu.getGrade()))
                                .toList();

                ResumeResponse defaultResume = resumeRepository.findAllByJobSeeker(seeker).stream()
                                .filter(Resume::getIsDefault)
                                .findFirst()
                                .map(this::toResumeResponse)
                                .orElse(null);

                return CandidateProfileResponse.builder()
                                .profile(JobSeekerProfileDTO.builder()
                                                .id(seeker.getId())
                                                .name(getSeekerName(seeker))
                                                .email(seeker.getUser() != null ? seeker.getUser().getEmail() : null)
                                                .phone(seeker.getPhone())
                                                .location(seeker.getLocation())
                                                .headline(seeker.getHeadline())
                                                .build())
                                .skills(skills)
                                .workExperience(workExperience)
                                .education(education)
                                .defaultResume(defaultResume)
                                .build();
        }

        private ResumeResponse toResumeResponse(Resume resume) {
                return ResumeResponse.builder()
                                .id(resume.getId())
                                .seekerId(resume.getJobSeeker().getId())
                                .fileUrl(s3ResumeStorageService.createPresignedUrl(resume.getFileUrl()))
                                .fileName(resume.getFileName())
                                .fileType(resume.getFileType())
                                .isDefault(resume.getIsDefault())
                                .visibility(resume.getVisibility())
                                .uploadedAt(resume.getUploadedAt())
                                .build();
        }

        private String getSeekerName(JobSeeker seeker) {
                return ((seeker.getFirstName() != null ? seeker.getFirstName() : "") + " "
                                + (seeker.getLastName() != null ? seeker.getLastName() : "")).trim();
        }
}
