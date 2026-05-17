package com.example.backend_careercrafter.dto.profile;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String headline;
}
