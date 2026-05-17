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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_careercrafter.dto.resume.SkillRequest;
import com.example.backend_careercrafter.dto.resume.SkillResponse;
import com.example.backend_careercrafter.model.resume.SeekerSkill;
import com.example.backend_careercrafter.service.resume.SkillService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/resume")
public class SkillController {

    private final SkillService skillService;

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/skills")
    public ResponseEntity<SeekerSkill> addSkill(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SkillRequest request) {
        SeekerSkill seekerSkill = skillService.addSkill(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(seekerSkill);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/skills")
    public ResponseEntity<List<SkillResponse>> getSkills(@AuthenticationPrincipal UserDetails userDetails) {
        List<SkillResponse> skills = skillService.getSkills(userDetails.getUsername());
        return ResponseEntity.ok(skills);
    }

    @PreAuthorize("hasRole('JOB_SEEKER')")
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        skillService.deleteSkill(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
