package com.example.backend_careercrafter.controller.resume;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_careercrafter.dto.resume.WorkExperienceRequest;
import com.example.backend_careercrafter.dto.resume.WorkExperienceResponse;
import com.example.backend_careercrafter.model.resume.WorkExperience;
import com.example.backend_careercrafter.service.resume.WorkExperienceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/resume")
public class WorkExperienceController {

    private final WorkExperienceService workExperienceRepository;

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/experience")
    public ResponseEntity<WorkExperienceResponse> addWorkExperience(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WorkExperienceRequest request) {
        WorkExperience work = workExperienceRepository.addWorkExperience(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(work));
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/experience")
    public ResponseEntity<List<WorkExperienceResponse>> getExperience(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<WorkExperienceResponse> experience = workExperienceRepository.getExperience(userDetails.getUsername());
        return ResponseEntity.ok(experience);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PutMapping("/experience/{id}")
    public ResponseEntity<WorkExperienceResponse> updateWorkExperience(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody WorkExperienceRequest request) {
        WorkExperience updated = workExperienceRepository.updateWorkExperience(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(toResponse(updated));
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Void> deleteWorkExperience(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        workExperienceRepository.deleteWorkExperience(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    private WorkExperienceResponse toResponse(WorkExperience work) {
        return new WorkExperienceResponse(
                work.getId(),
                work.getCompany(),
                work.getPosition(),
                work.getStartDate() != null ? work.getStartDate().toString() : null,
                work.getEndDate() != null ? work.getEndDate().toString() : null,
                work.getLocation(),
                work.getDescription());
    }
}
