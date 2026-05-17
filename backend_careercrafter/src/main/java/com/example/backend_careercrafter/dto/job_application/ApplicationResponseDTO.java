package com.example.backend_careercrafter.dto.job_application;

import java.time.LocalDateTime;

import com.example.backend_careercrafter.dto.profile.JobSeekerProfileDTO;
import com.example.backend_careercrafter.dto.resume.ResumeDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String status;
    private LocalDateTime appliedDate;
    private String coverLetter;
    private String experienceLevel;
    private String portfolioUrl;
    private Long resumeId;

    private JobSeekerProfileDTO seekerProfile;
    private ResumeDTO resume;

    public ApplicationResponseDTOBuilder toBuilder() {
        return ApplicationResponseDTO.builder()
                .id(this.id)
                .jobId(this.jobId)
                .jobTitle(this.jobTitle)
                .companyName(this.companyName)
                .status(this.status)
                .appliedDate(this.appliedDate)
                .coverLetter(this.coverLetter)
                .experienceLevel(this.experienceLevel)
                .portfolioUrl(this.portfolioUrl)
                .resumeId(this.resumeId)
                .seekerProfile(this.seekerProfile)
                .resume(this.resume);
    }
}