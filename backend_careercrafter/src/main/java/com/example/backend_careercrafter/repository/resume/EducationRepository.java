package com.example.backend_careercrafter.repository.resume;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.Education;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByJobSeeker(JobSeeker jobSeeker);
}
