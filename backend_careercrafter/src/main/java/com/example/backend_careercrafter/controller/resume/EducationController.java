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

import com.example.backend_careercrafter.dto.resume.EducationRequest;
import com.example.backend_careercrafter.dto.resume.EducationResponse;
import com.example.backend_careercrafter.model.resume.Education;
import com.example.backend_careercrafter.service.resume.EducationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/resume")
public class EducationController {

    private final EducationService educationService;

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/education")
    public ResponseEntity<EducationResponse> addEducation(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EducationRequest request) {
        Education education = educationService.addEducation(userDetails.getUsername(), request);
        EducationResponse dto = new EducationResponse(
                education.getId(),
                education.getInstitution(),
                education.getDegree(),
                education.getFieldOfStudy(),
                education.getDescription(),
                education.getGraduationDate() != null ? education.getGraduationDate().toString() : null,
                education.getGrade());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/education")
    public ResponseEntity<List<EducationResponse>> getEducation(@AuthenticationPrincipal UserDetails userDetails) {
        List<EducationResponse> education = educationService.getEducation(userDetails.getUsername());
        return ResponseEntity.ok(education);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PutMapping("/education/{id}")
    public ResponseEntity<EducationResponse> updateEducation(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody EducationRequest request) {
        Education updated = educationService.updateEducation(userDetails.getUsername(), id, request);
        EducationResponse dto = new EducationResponse(
                updated.getId(),
                updated.getInstitution(),
                updated.getDegree(),
                updated.getFieldOfStudy(),
                updated.getGrade(),
                updated.getDescription(),
                updated.getGraduationDate() != null ? updated.getGraduationDate().toString() : null);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @DeleteMapping("/education/{id}")
    public ResponseEntity<Void> deleteEducation(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        educationService.deleteEducation(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}