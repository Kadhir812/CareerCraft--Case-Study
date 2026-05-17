package com.example.backend_careercrafter.service.resume;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.resume.SkillRequest;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.SeekerSkill;
import com.example.backend_careercrafter.model.resume.Skill;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.SeekerSkillRepository;
import com.example.backend_careercrafter.repository.resume.SkillRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SeekerSkillService {

    private JobSeekerRepository jobSeekerRepository;
    private SkillRepository skillRepository;
    private SeekerSkillRepository seekerSkillRepository;

    public SeekerSkill addSkill(String userEmail, SkillRequest request) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + userEmail));
        Skill skill = skillRepository.findBySkillName(request.getSkillName())
                .orElseGet(() -> skillRepository.save(Skill.builder().skillName(request.getSkillName()).build()));
        SeekerSkill seekerSkill = SeekerSkill.builder()
                .jobSeeker(jobSeeker)
                .skill(skill)
                .build();
        return seekerSkillRepository.save(seekerSkill);
    }

}
