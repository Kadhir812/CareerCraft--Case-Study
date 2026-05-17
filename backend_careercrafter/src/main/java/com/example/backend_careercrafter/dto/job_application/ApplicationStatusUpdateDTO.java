package com.example.backend_careercrafter.dto.job_application;

import com.example.backend_careercrafter.model.enums.Status;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusUpdateDTO {
    
    @NotNull
    private Status status;

}
