package com.example.backend_careercrafter.service.resume;

import java.util.List;
import java.util.stream.Collectors;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend_careercrafter.dto.resume.ResumeResponse;
import com.example.backend_careercrafter.model.resume.Resume;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.ResumeRepository;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeService {

    private final JobSeekerRepository jobSeekerRepository;
    private final ResumeRepository resumeRepository;
    private final S3ResumeStorageService s3ResumeStorageService;

    public List<ResumeResponse> getResumesForUser(String userEmail) {
        var jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        List<Resume> resumes = resumeRepository.findAllByJobSeeker(jobSeeker);
        return resumes.stream()
                .map(this::toResumeResponse)
                .collect(Collectors.toList());
    }

    public ResumeResponse uploadResume(String userEmail, MultipartFile file, boolean isDefault, String visibility) {
        log.info("Uploading resume for user: {}", userEmail);
        var jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));

        // If this resume is to be default, unset isDefault for all other resumes
        if (isDefault) {
            List<Resume> existingResumes = resumeRepository.findAllByJobSeeker(jobSeeker);
            for (Resume r : existingResumes) {
                if (Boolean.TRUE.equals(r.getIsDefault())) {
                    r.setIsDefault(false);
                    resumeRepository.save(r);
                }
            }
        }

        //checking extension with only supported types
        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")//extract the extension  
                ? originalName.substring(originalName.lastIndexOf('.') + 1).toUpperCase() //pdf -> PDF
                : "";//remember sliding window substring
                
        Resume.FileType fileType;
        try {
            fileType = Resume.FileType.valueOf(ext);
        } catch (Exception e) {
            log.error("Invalid file type: {}. Only PDF, DOC, DOCX allowed.", ext);
            throw new IllegalArgumentException("Invalid file type. Only PDF, DOC, DOCX allowed.");
        }


        //resume storing
        String objectName = "resumes/" + jobSeeker.getId() + "/" + UUID.randomUUID() + "." + ext.toLowerCase();
        try {
            s3ResumeStorageService.upload(objectName, file);
        } catch (Exception e) {
            log.error("Failed to upload file to S3: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to S3", e);
        }


        //private or employee
        Resume.Visibility visibilityEnum;
        try {
            visibilityEnum = Resume.Visibility.valueOf(visibility.toUpperCase());
        } catch (Exception e) {
            log.error("Invalid visibility value: {}", visibility);
            throw new IllegalArgumentException("Invalid visibility value.");
        }
        Resume resume = Resume.builder()
                .jobSeeker(jobSeeker)
                .fileUrl(objectName)
                .fileName(originalName)
                .fileType(fileType)
                .isDefault(isDefault)
                .visibility(visibilityEnum)
                .uploadedAt(java.time.Instant.now())
                .build();
        Resume saved = resumeRepository.save(resume);
        log.info("Resume saved to database with id: {}", saved.getId());
        return toResumeResponse(saved);
    }

    public void deleteResume(String userEmail, Long resumeId) {
        var jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with id: " + resumeId));
        if (resume.getJobSeeker().getId() != jobSeeker.getId()) {
            throw new SecurityException("You are not authorized to delete this resume.");
        }

        try {
            log.info("Deleting object from S3: {}", resume.getFileUrl());
            s3ResumeStorageService.delete(resume.getFileUrl());
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", e.getMessage(), e);
        }

        resumeRepository.delete(resume);
        log.info("Resume deleted from database with id: {}", resumeId);
    }

    public void setDefaultResume(String userEmail, Long resumeId) {
        var jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with id: " + resumeId));
        if (resume.getJobSeeker().getId() != jobSeeker.getId()) {
            throw new SecurityException("You are not authorized to set this resume as default.");
        }
        // Unset all other resumes
        List<Resume> resumes = resumeRepository.findAllByJobSeeker(jobSeeker);
        for (Resume r : resumes) {
            if (Boolean.TRUE.equals(r.getIsDefault())) {
                r.setIsDefault(false);
                resumeRepository.save(r);
            }
        }
        resume.setIsDefault(true);
        resumeRepository.save(resume);
        log.info("Set resume {} as default for user {}", resumeId, userEmail);
    }

    public List<ResumeResponse> getResumesForEmployer() {
        List<Resume> resumes = resumeRepository.findAll();
        return resumes.stream()
                .filter(r -> r.getVisibility() == Resume.Visibility.EMPLOYERS_ONLY)
                .map(this::toResumeResponse)
                .collect(Collectors.toList());
    }

    public void updateResumeVisibility(String userEmail, Long resumeId, String visibility) {
        var jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with id: " + resumeId));
        if (resume.getJobSeeker().getId() != jobSeeker.getId()) {
            throw new SecurityException("You are not authorized to update this resume.");
        }
        Resume.Visibility visibilityEnum;
        try {
            visibilityEnum = Resume.Visibility.valueOf(visibility.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid visibility value: " + visibility);
        }
        resume.setVisibility(visibilityEnum);
        resumeRepository.save(resume);
        log.info("Updated visibility of resume {} to {} for user {}", resumeId, visibility, userEmail);
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
}
