package com.example.backend_careercrafter.service;

import com.example.backend_careercrafter.dto.job.JobCreateRequest;
import com.example.backend_careercrafter.dto.job.JobListingResponse;
import com.example.backend_careercrafter.dto.job.JobUpdateRequest;
import com.example.backend_careercrafter.exceptions.ResourceNotFoundException;
import com.example.backend_careercrafter.model.Employer;
import com.example.backend_careercrafter.model.JobListing;
import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.JobType;
import com.example.backend_careercrafter.repository.EmployerRepository;
import com.example.backend_careercrafter.repository.JobListingRepository;
import com.example.backend_careercrafter.specification.JobListingSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobListingService {

    private final EmployerRepository employerRepository;
    private final JobListingRepository jobListingRepository;

    @Transactional
    public JobListingResponse createJob(String email, JobCreateRequest request) {

        Employer employer = employerRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        if (request.getSalaryMin() > request.getSalaryMax()) {
            throw new IllegalArgumentException("Min salary cannot be greater than max salary");
        }

        JobListing job = JobListing.builder()
                .employer(employer)
                .title(trim(request.getTitle()))
                .description(trim(request.getDescription()))
                .requirements(trimToNull(request.getRequirements()))
                .location(trim(request.getLocation()))
                .jobType(request.getJobType())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .deadline(request.getDeadline())
                .status(JobStatus.ACTIVE)
                .build();

        JobListing saved = jobListingRepository.save(job);

        log.info("Created job {} by employer {}", saved.getId(), employer.getId());

        return toResponse(saved);
    }

    @Transactional
    public JobListingResponse updateJob(String email, Long jobId, JobUpdateRequest request) {

        JobListing job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        validateOwner(email, job);

        if (request.getSalaryMin() > request.getSalaryMax()) {
            throw new IllegalArgumentException("Min salary cannot be greater than max salary");
        }

        job.setTitle(trim(request.getTitle()));
        job.setDescription(trim(request.getDescription()));
        job.setRequirements(trimToNull(request.getRequirements()));
        job.setLocation(trim(request.getLocation()));
        job.setJobType(request.getJobType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setDeadline(request.getDeadline());
        job.setStatus(request.getStatus());

        JobListing saved = jobListingRepository.save(job);

        log.info("Updated job {} by employer {}", saved.getId(), saved.getEmployer().getId());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<JobListingResponse> searchJobs(String query, String location, JobType type, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedDate"));

        Specification<JobListing> spec = Specification
                .where(JobListingSpecification.withStatus(JobStatus.ACTIVE))
                .and(JobListingSpecification.withTextQuery(query))
                .and(JobListingSpecification.withLocation(location))
                .and(JobListingSpecification.withJobType(type));

        return jobListingRepository.findAll(spec, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<JobListingResponse> getMyJobs(String email, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedDate"));

        return jobListingRepository
                .findByEmployerUserEmail(email, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public JobListingResponse getJobById(Long jobId) {

        JobListing job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        return toResponse(job);
    }

    private void validateOwner(String email, JobListing job) {
        if (!job.getEmployer().getUser().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Not allowed to modify this job");
        }
    }

    private JobListingResponse toResponse(JobListing model) {
        return JobListingResponse.builder()
                .jobId(model.getId())
                .employerId(model.getEmployer() != null ? model.getEmployer().getId() : null)
                .companyName(model.getEmployer() != null ? model.getEmployer().getCompanyName() : null)
                .title(model.getTitle())
                .description(model.getDescription())
                .requirements(model.getRequirements())
                .location(model.getLocation())
                .jobType(model.getJobType())
                .salaryMin(model.getSalaryMin())
                .salaryMax(model.getSalaryMax())
                .postedDate(model.getPostedDate())
                .deadline(model.getDeadline())
                .status(model.getStatus())
                .build();
    }

    private String trim(String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException("Field cannot be empty");
        }
        return value.trim();
    }

    private String trimToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}