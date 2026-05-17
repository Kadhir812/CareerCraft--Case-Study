package com.example.backend_careercrafter.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.backend_careercrafter.dto.job_application.ApplicationRequestDTO;
import com.example.backend_careercrafter.dto.job_application.ApplicationResponseDTO;
import com.example.backend_careercrafter.dto.job_application.ApplicationStatusUpdateDTO;
import com.example.backend_careercrafter.service.ApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @Operation(summary = "Apply to a job", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> applyToJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ApplicationRequestDTO dto) {
        return ResponseEntity.ok(applicationService.applyToJob(userDetails.getUsername(), dto));
    }

    @Operation(summary = "View my applications", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUsername()));
    }

    @Operation(summary = "Update application status", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('EMPLOYER')")
    @PatchMapping("/{appId}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long appId,
            @Valid @RequestBody ApplicationStatusUpdateDTO dto) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(userDetails.getUsername(), appId, dto));
    }

    @Operation(summary = "Get application by ID", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/{appId}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long appId) {
        return ResponseEntity.ok(applicationService.getApplicationByIdForEmployer(userDetails.getUsername(), appId));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsForJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsForJob(userDetails.getUsername(), jobId));
    }

}