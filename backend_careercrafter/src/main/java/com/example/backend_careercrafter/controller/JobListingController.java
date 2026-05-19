package com.example.backend_careercrafter.controller;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_careercrafter.dto.job.JobCreateRequest;
import com.example.backend_careercrafter.dto.job.JobListingResponse;
import com.example.backend_careercrafter.dto.job.JobUpdateRequest;
import com.example.backend_careercrafter.model.enums.JobType;
import com.example.backend_careercrafter.service.JobListingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Job Listing", description = "APIs for creating, updating, and searching jobs")
public class JobListingController {

    private final JobListingService jobListingService;

    @Operation(summary = "Create a new job listing")
    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JobListingResponse> createJob(
            Principal principal,
            @Valid @RequestBody JobCreateRequest request) {
        JobListingResponse response = jobListingService.createJob(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Update an existing job listing")
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping(path = "/{jobId:\\d+}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JobListingResponse> updateJob(
            Principal principal,
            @PathVariable Long jobId,
            @Valid @RequestBody JobUpdateRequest request) {
        JobListingResponse response = jobListingService.updateJob(principal.getName(), jobId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Search active job listings")
    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<Page<JobListingResponse>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<JobListingResponse> response = jobListingService.searchJobs(query, location, type, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get current employer's job listings")
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/my")
    public ResponseEntity<Page<JobListingResponse>> getMyJobs(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<JobListingResponse> response = jobListingService.getMyJobs(principal.getName(), page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get details of a job listing")
    @PreAuthorize("permitAll()")
    @GetMapping("/{jobId:\\d+}")
    public ResponseEntity<JobListingResponse> getJobById(@PathVariable Long jobId) {
        JobListingResponse response = jobListingService.getJobById(jobId);
        return ResponseEntity.ok(response);
    }
}