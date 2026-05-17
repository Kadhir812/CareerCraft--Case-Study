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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend_careercrafter.dto.resume.ResumeResponse;
import com.example.backend_careercrafter.dto.resume.ResumeUploadRequest;
import com.example.backend_careercrafter.service.resume.ResumeService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private final ResumeService resumeService;

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/list")
    public ResponseEntity<List<ResumeResponse>> getResumes(@AuthenticationPrincipal UserDetails userDetails) {
        List<ResumeResponse> resumes = resumeService.getResumesForUser(userDetails.getUsername());
        return ResponseEntity.ok(resumes);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean isDefault,
            @RequestParam(defaultValue = "PRIVATE") String visibility) {
        ResumeResponse response = resumeService.uploadResume(userDetails.getUsername(), file, isDefault, visibility);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        resumeService.deleteResume(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/{id}/set-default")
    public ResponseEntity<Void> setDefaultResume(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        resumeService.setDefaultResume(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping("/search")
    public ResponseEntity<List<ResumeResponse>> searchResumesForEmployer() {
        List<ResumeResponse> resumes = resumeService.getResumesForEmployer();
        return ResponseEntity.ok(resumes);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PutMapping("/{id}/visibility")
    public ResponseEntity<Void> updateVisibility(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ResumeUploadRequest request) {
        resumeService.updateResumeVisibility(userDetails.getUsername(), id, request.getVisibility());
        return ResponseEntity.ok().build();
    }
}
