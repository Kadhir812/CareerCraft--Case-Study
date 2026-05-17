package com.example.backend_careercrafter.dto.job;

import java.time.Instant;

import com.example.backend_careercrafter.model.enums.JobType;


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
public class JobCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String requirements;

    @NotBlank
    private String location;

    @NotNull
    private JobType jobType;

    @NotNull
    private Long salaryMin;

    @NotNull
    private Long salaryMax;

    @NotNull
    private Instant deadline;
}
