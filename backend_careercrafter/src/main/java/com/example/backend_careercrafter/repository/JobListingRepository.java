package com.example.backend_careercrafter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.backend_careercrafter.model.JobListing;

public interface JobListingRepository
        extends JpaRepository<JobListing, Long>, JpaSpecificationExecutor<JobListing> {

    Page<JobListing> findByEmployerUserEmail(String email, Pageable pageable);
}