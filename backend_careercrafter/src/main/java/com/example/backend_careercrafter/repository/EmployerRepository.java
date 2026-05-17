package com.example.backend_careercrafter.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_careercrafter.model.Employer;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Optional<Employer> findByUserEmail(String email);
}
