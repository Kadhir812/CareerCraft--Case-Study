package com.example.backend_careercrafter.dto.resume;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkExperienceResponse {
    private Long id;
    private String company;
    private String position;
    private String startDate;
    private String endDate;
    private String location;
    private String description;
}