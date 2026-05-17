package com.example.backend_careercrafter.dto.resume;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillRequest {
    @NotBlank
    private String skillName;
}