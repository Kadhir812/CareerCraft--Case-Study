package com.example.backend_careercrafter.dto.job;

import java.time.Instant;

import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.JobType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobUpdateRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    private String requirements;

    @NotBlank(message = "Location cannot be empty")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotNull(message = "Minimum salary is required")
    @Min(value = 0, message = "Minimum salary cannot be negative")
    private Long salaryMin;

    @NotNull(message = "Maximum salary is required")
    @Min(value = 0, message = "Maximum salary cannot be negative")
    private Long salaryMax;

    @NotNull(message = "Deadline is required")
    private Instant deadline;

    @NotNull(message = "Status is required")
    private JobStatus status;
}
