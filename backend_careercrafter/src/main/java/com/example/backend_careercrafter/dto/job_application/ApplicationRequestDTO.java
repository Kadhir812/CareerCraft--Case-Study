package com.example.backend_careercrafter.dto.job_application;

import com.example.backend_careercrafter.model.enums.ExperienceLevel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequestDTO {
    @NotNull
    private Long jobId;

    @NotBlank
    private String coverLetter;

    @NotNull
    private ExperienceLevel experienceLevel;

    private String portfolioUrl;
    private Long resumeId;

}