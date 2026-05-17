package com.example.backend_careercrafter.dto.resume;

import com.example.backend_careercrafter.model.resume.Resume;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {
    private Long id;
    private Long seekerId;
    private String fileUrl;
    private String fileName;
    private Resume.FileType fileType;
    private Boolean isDefault;
    private Resume.Visibility visibility;
    private java.time.Instant uploadedAt;
}
