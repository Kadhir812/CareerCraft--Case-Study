package com.example.backend_careercrafter.dto.job;

import java.time.Instant;

import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.JobType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListingResponse {
    private Long jobId;
    private Long employerId;
    private String companyName;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private JobType jobType;
    private Long salaryMin;
    private Long salaryMax;
    private Instant postedDate;
    private Instant deadline;
    private JobStatus status;
}
