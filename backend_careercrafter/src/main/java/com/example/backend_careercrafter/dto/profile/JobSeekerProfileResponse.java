package com.example.backend_careercrafter.dto.profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobSeekerProfileResponse {

    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String phone;
    private String location;
    private String headline;
}