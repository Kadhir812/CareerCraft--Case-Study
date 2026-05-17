package com.example.backend_careercrafter.dto.resume;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ResumeUploadRequest {
    private MultipartFile file;
    private boolean isDefault;
    private String visibility;
}