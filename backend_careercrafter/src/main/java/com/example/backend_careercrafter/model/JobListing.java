package com.example.backend_careercrafter.model;

import java.time.Instant;

import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.JobType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "JOB_LISTING")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PK_jobID")
    private Long id;

// One employer posts many job listings
// Each job listing posted by one employer
    @ManyToOne(optional = false)
    @JoinColumn(name = "FK_employerID", nullable = false)
    private Employer employer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType;

    @Column(nullable = false)
    private Long salaryMin;

    @Column(nullable = false)
    private Long salaryMax;

    @Column(nullable = false, updatable = false)
    private Instant postedDate;

    @Column(nullable = false)
    private Instant deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status;

    @PrePersist
    void prePersist() {
        if (postedDate == null) {
            postedDate = Instant.now();
        }
        if (status == null) {
            status = JobStatus.ACTIVE;
        }
    }
}