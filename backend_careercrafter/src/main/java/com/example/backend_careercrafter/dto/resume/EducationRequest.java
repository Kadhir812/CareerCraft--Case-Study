package com.example.backend_careercrafter.dto.resume;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

@Data
public class EducationRequest {
    @NotBlank
    private String institution;
    @NotBlank
    private String degree;
    private String fieldOfStudy;

    private String description;
    @NotNull
    @PastOrPresent
    private LocalDate graduationDate;
    private String grade;
}