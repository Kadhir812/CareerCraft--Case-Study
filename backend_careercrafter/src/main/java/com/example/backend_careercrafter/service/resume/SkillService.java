package com.example.backend_careercrafter.service.resume;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend_careercrafter.dto.resume.SkillRequest;
import com.example.backend_careercrafter.dto.resume.SkillResponse;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.resume.SeekerSkill;
import com.example.backend_careercrafter.model.resume.Skill;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.resume.SeekerSkillRepository;
import com.example.backend_careercrafter.repository.resume.SkillRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final SeekerSkillRepository seekerSkillRepository;

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

    public List<SkillResponse> getSkills(String username) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + username));
        return seekerSkillRepository.findByJobSeeker(jobSeeker)
                .stream()
                .map(seekerSkill -> new SkillResponse(seekerSkill.getId(), seekerSkill.getSkill().getSkillName()))
                .collect(Collectors.toList());
    }

    public void deleteSkill(String username, Long skillId) {
        JobSeeker jobSeeker = jobSeekerRepository.findByUserEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found for user: " + username));
        SeekerSkill seekerSkill = seekerSkillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + skillId));
        if (seekerSkill.getJobSeeker().getId() != jobSeeker.getId()) {
            throw new SecurityException("Unauthorized to delete this skill");
        }
        seekerSkillRepository.deleteById(skillId);
    }
}
