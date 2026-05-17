package com.example.backend_careercrafter.dto.profile;


import java.util.List;

import com.example.backend_careercrafter.dto.resume.EducationResponse;
import com.example.backend_careercrafter.dto.resume.ResumeResponse;
import com.example.backend_careercrafter.dto.resume.SkillResponse;
import com.example.backend_careercrafter.dto.resume.WorkExperienceResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateProfileResponse {
    private JobSeekerProfileDTO profile;
    private List<SkillResponse> skills;
    private List<WorkExperienceResponse> workExperience;
    private List<EducationResponse> education;
    private ResumeResponse defaultResume;
}
