package com.example.backend_careercrafter.service;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.profile.EmployerProfileResponse;
import com.example.backend_careercrafter.dto.profile.EmployerProfileUpdateRequest;
import com.example.backend_careercrafter.exceptions.ResourceNotFoundException;
import com.example.backend_careercrafter.model.Employer;
import com.example.backend_careercrafter.repository.EmployerRepository;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployerProfileService {

    private final EmployerRepository employerRepository;

    @Transactional(readOnly = true)
    public EmployerProfileResponse getMyProfile(String email) {
        Employer employer = employerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        return toResponse(employer);
    }

    @Transactional
    public EmployerProfileResponse updateMyProfile(String email, EmployerProfileUpdateRequest request) {
        Employer employer = employerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        employer.setContactFirstName(request.getContactFirstName().trim());
        employer.setContactLastName(request.getContactLastName().trim());
        employer.setCompanyName(request.getCompanyName().trim());
        employer.setIndustry(request.getIndustry());
        employer.setWebsite(request.getWebsite());

        Employer saved = employerRepository.save(employer);
        log.info("Updated employer profile for user: {}", email);
        return toResponse(saved);
    }

    private EmployerProfileResponse toResponse(Employer employer) {
        return EmployerProfileResponse.builder()
                .email(employer.getUser().getEmail())
                .role(employer.getUser().getRole().name())
                .contactFirstName(employer.getContactFirstName())
                .contactLastName(employer.getContactLastName())
                .companyName(employer.getCompanyName())
                .industry(employer.getIndustry())
                .website(employer.getWebsite())
                .verifiedStatus(employer.getVerifiedStatus())
                .build();
    }
}