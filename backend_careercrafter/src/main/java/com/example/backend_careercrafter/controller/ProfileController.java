package com.example.backend_careercrafter.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_careercrafter.dto.profile.CandidateProfileResponse;
import com.example.backend_careercrafter.dto.profile.EmployerProfileResponse;
import com.example.backend_careercrafter.dto.profile.EmployerProfileUpdateRequest;
import com.example.backend_careercrafter.dto.profile.JobSeekerProfileResponse;
import com.example.backend_careercrafter.dto.profile.JobSeekerProfileUpdateRequest;
import com.example.backend_careercrafter.service.CandidateProfileService;
import com.example.backend_careercrafter.service.EmployerProfileService;
import com.example.backend_careercrafter.service.JobSeekerProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/profile", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Profile", description = "APIs for authenticated user profile")
public class ProfileController {

    private final JobSeekerProfileService jobSeekerProfileService;
    private final EmployerProfileService employerProfileService;
    private final CandidateProfileService candidateProfileService;

    @Operation(summary = "Get current job seeker profile")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/me")
    public ResponseEntity<JobSeekerProfileResponse> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        JobSeekerProfileResponse response = jobSeekerProfileService.getMyProfile(email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update current job seeker profile")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PutMapping(path = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JobSeekerProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody JobSeekerProfileUpdateRequest request) {
        String email = authentication.getName();
        JobSeekerProfileResponse response = jobSeekerProfileService.updateMyProfile(email, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get current employer profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/employer/me")
    public ResponseEntity<EmployerProfileResponse> getMyEmployerProfile(Authentication authentication) {
        String email = authentication.getName();
        EmployerProfileResponse response = employerProfileService.getMyProfile(email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update current employer profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping(path = "/employer/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EmployerProfileResponse> updateMyEmployerProfile(
            Authentication authentication,
            @Valid @RequestBody EmployerProfileUpdateRequest request) {
        String email = authentication.getName();
        EmployerProfileResponse response = employerProfileService.updateMyProfile(email, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get candidate profile for employer review")
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/job-seeker/{seekerId}")
    public ResponseEntity<CandidateProfileResponse> getCandidateProfile(
            Authentication authentication,
            @PathVariable Long seekerId) {
        String email = authentication.getName();
        CandidateProfileResponse response = candidateProfileService.getCandidateProfile(email, seekerId);
        return ResponseEntity.ok(response);
    }
}