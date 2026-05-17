package com.example.backend_careercrafter.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_careercrafter.model.JobSeeker;

public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {

    Optional<JobSeeker> findByUserEmail(String email);
}
