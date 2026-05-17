package com.example.backend_careercrafter.dto.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfileUpdateRequest {

    @NotBlank(message = "Contact first name cannot be empty")
    private String contactFirstName;

    @NotBlank(message = "Contact last name cannot be empty")
    private String contactLastName;

    @NotBlank(message = "Company name cannot be empty")
    private String companyName;

    private String industry;

    private String website;
}
