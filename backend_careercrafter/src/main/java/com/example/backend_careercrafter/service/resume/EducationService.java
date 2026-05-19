package com.example.backend_careercrafter.service.resume;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.resume.EducationRequest;
import com.example.backend_careercrafter.dto.resume.EducationResponse;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.Education;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.EducationRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EducationService {

    private final JobSeekerRepository jobSeekerRepository;
    private final EducationRepository educationRepository;

    public Education addEducation(String userEmail, EducationRequest request) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Education education = Education.builder()
                .jobSeeker(jobSeeker)
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .description(request.getDescription())
                .graduationDate(request.getGraduationDate())
                .grade(request.getGrade())
                .build();
        return educationRepository.save(education);
    }

    public List<EducationResponse> getEducation(String username) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + username));
        return educationRepository.findAll().stream()
                .filter(edu -> edu.getJobSeeker().equals(jobSeeker))// Keeps only education belonging to
                                                                            // logged-in user.
                .map(edu -> new EducationResponse(
                        edu.getId(),
                        edu.getInstitution(),
                        edu.getDegree(),
                        edu.getFieldOfStudy(),
                        edu.getDescription(),
                        edu.getGraduationDate() != null ? edu.getGraduationDate().toString() : null,
                        edu.getGrade()))
                .collect(Collectors.toList());
    }

    public Education updateEducation(String userEmail, Long id, EducationRequest request) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Education not found: " + id));
        if (!edu.getJobSeeker().equals(jobSeeker)) {
            throw new SecurityException("Unauthorized to update this education");
        }
        edu.setInstitution(request.getInstitution());
        edu.setDegree(request.getDegree());
        edu.setFieldOfStudy(request.getFieldOfStudy());
        edu.setDescription(request.getDescription());
        edu.setGraduationDate(request.getGraduationDate());
        edu.setGrade(request.getGrade());
        return educationRepository.save(edu);
    }

    public void deleteEducation(String userEmail, Long id) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Education not found: " + id));
        if (!edu.getJobSeeker().equals(jobSeeker)) {
            throw new SecurityException("Unauthorized to delete this education");
        }
        educationRepository.delete(edu);
    }

}