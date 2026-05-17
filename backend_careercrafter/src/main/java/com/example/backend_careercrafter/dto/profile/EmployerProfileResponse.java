package com.example.backend_careercrafter.dto.profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployerProfileResponse {

    private String email;
    private String role;
    private String contactFirstName;
    private String contactLastName;
    private String companyName;
    private String industry;
    private String website;
    private String verifiedStatus;
}
