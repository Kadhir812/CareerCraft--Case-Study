package com.example.backend_careercrafter.service;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.profile.JobSeekerProfileResponse;
import com.example.backend_careercrafter.dto.profile.JobSeekerProfileUpdateRequest;
import com.example.backend_careercrafter.exceptions.ResourceNotFoundException;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.repository.JobSeekerRepository;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobSeekerProfileService {

    private final JobSeekerRepository jobSeekerRepository;

    @Transactional(readOnly = true)
    public JobSeekerProfileResponse getMyProfile(String email) {
        JobSeeker seeker = jobSeekerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Job seeker profile not found"));

        return toResponse(seeker);
    }

    @Transactional
    public JobSeekerProfileResponse updateMyProfile(String email, JobSeekerProfileUpdateRequest request) {
        JobSeeker seeker = jobSeekerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Job seeker profile not found"));

        seeker.setFirstName(request.getFirstName().trim());
        seeker.setLastName(request.getLastName().trim());
        seeker.setPhone(request.getPhone());
        seeker.setLocation(request.getLocation());
        seeker.setHeadline(request.getHeadline());

        JobSeeker saved = jobSeekerRepository.save(seeker);
        log.info("Updated job seeker profile for user: {}", email);
        return toResponse(saved);
    }

    private JobSeekerProfileResponse toResponse(JobSeeker seeker) {
        return JobSeekerProfileResponse.builder()
                .email(seeker.getUser().getEmail())
                .role(seeker.getUser().getRole().name())
                .firstName(seeker.getFirstName())
                .lastName(seeker.getLastName())
                .phone(seeker.getPhone())
                .location(seeker.getLocation())
                .headline(seeker.getHeadline())
                .build();
    }
}
