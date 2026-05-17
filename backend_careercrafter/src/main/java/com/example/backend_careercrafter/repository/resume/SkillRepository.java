package com.example.backend_careercrafter.repository.resume;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_careercrafter.model.resume.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findBySkillName(String skillName);
}