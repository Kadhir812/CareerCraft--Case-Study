package com.example.backend_careercrafter.dto.resume;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponse {
    private Long id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String description;
    private String graduationDate; // Use String for easy serialization
    private String grade;
}