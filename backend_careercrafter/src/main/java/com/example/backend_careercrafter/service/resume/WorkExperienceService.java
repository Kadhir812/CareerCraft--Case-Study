package com.example.backend_careercrafter.service.resume;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.resume.WorkExperienceRequest;
import com.example.backend_careercrafter.dto.resume.WorkExperienceResponse;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.WorkExperience;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.WorkExperienceRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class WorkExperienceService {

    private final JobSeekerRepository jobSeekerRepository;
    private final WorkExperienceRepository workExperienceRepository;

    public WorkExperience addWorkExperience(String userEmail, WorkExperienceRequest request) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        WorkExperience work = WorkExperience.builder()
                .jobSeeker(jobSeeker)
                .company(request.getCompany())
                .position(request.getPosition())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .location(request.getLocation())
                .description(request.getDescription())
                .build();
        return workExperienceRepository.save(work);
    }

    public List<WorkExperienceResponse> getExperience(String username) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + username));
        return workExperienceRepository.findAll().stream()
                .filter(work -> work.getJobSeeker().equals(jobSeeker))
                .map(work -> new WorkExperienceResponse(
                        work.getId(),
                        work.getCompany(),
                        work.getPosition(),
                        work.getStartDate() != null ? work.getStartDate().toString() : null,
                        work.getEndDate() != null ? work.getEndDate().toString() : null,
                        work.getLocation(),
                        work.getDescription()))
                .collect(Collectors.toList());
    }

    public WorkExperience updateWorkExperience(String userEmail, Long id, WorkExperienceRequest request) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        WorkExperience work = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("WorkExperience not found: " + id));
        if (!work.getJobSeeker().equals(jobSeeker)) {
            throw new SecurityException("Unauthorized to update this work experience");
        }
        work.setCompany(request.getCompany());
        work.setPosition(request.getPosition());
        work.setStartDate(request.getStartDate());
        work.setEndDate(request.getEndDate());
        work.setLocation(request.getLocation());
        work.setDescription(request.getDescription());
        return workExperienceRepository.save(work);
    }

    public void deleteWorkExperience(String userEmail, Long id) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        WorkExperience work = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("WorkExperience not found: " + id));
        if (!work.getJobSeeker().equals(jobSeeker)) {
            throw new SecurityException("Unauthorized to delete this work experience");
        }
        workExperienceRepository.delete(work);
    }
}