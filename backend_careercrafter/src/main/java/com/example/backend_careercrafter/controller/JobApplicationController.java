package com.example.backend_careercrafter.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_careercrafter.dto.job_application.ApplicationResponseDTO;
import com.example.backend_careercrafter.service.ApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs/{jobId}/applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final ApplicationService applicationService;

    @Operation(summary = "Employer views candidates for a job", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsForJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(userDetails.getUsername(), jobId));
    }
}