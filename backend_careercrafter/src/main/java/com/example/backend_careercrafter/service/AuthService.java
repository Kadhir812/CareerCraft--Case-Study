package com.example.backend_careercrafter.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.backend_careercrafter.dto.auth.AuthResponse;
import com.example.backend_careercrafter.dto.auth.LoginRequest;
import com.example.backend_careercrafter.dto.auth.RegisterRequest;
import com.example.backend_careercrafter.exceptions.ResourceConflictException;
import com.example.backend_careercrafter.model.Employer;
import com.example.backend_careercrafter.model.JobSeeker;
import com.example.backend_careercrafter.model.User;
import com.example.backend_careercrafter.model.enums.Role;
import com.example.backend_careercrafter.repository.EmployerRepository;
import com.example.backend_careercrafter.repository.JobSeekerRepository;
import com.example.backend_careercrafter.repository.UserRepository;
import com.example.backend_careercrafter.security.JwtService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // email already exists check
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ResourceConflictException("Email is already registered");
        }

        // create user
        User user = User.builder()
                .email(request.getEmail().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);

        // create profile based on role
        createProfile(savedUser, request);

        // generate JWT
        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name());

        log.info("User registered: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .role(savedUser.getRole())
                .email(savedUser.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim(),
                            request.getPassword()));
        } catch (BadCredentialsException ex) {
            log.warn("Invalid login attempt: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name());

        log.info("User login success: {}", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .role(user.getRole())
                .email(user.getEmail())
                .build();
    }

    private void createProfile(User user, RegisterRequest request) {

        if (user.getRole() == Role.JOB_SEEKER) {

            JobSeeker jobSeeker = JobSeeker.builder()
                    .user(user)
                    .firstName(trim(request.getFirstName()))
                    .lastName(trim(request.getLastName()))
                    .build();

            jobSeekerRepository.save(jobSeeker);
            return;
        }

        if (user.getRole() == Role.EMPLOYER) {

            if (!StringUtils.hasText(request.getCompanyName())) {
                throw new IllegalArgumentException("Company name is required");
            }

            Employer employer = Employer.builder()
                    .user(user)
                    .contactFirstName(trim(request.getFirstName()))
                    .contactLastName(trim(request.getLastName()))
                    .companyName(request.getCompanyName().trim())
                    .website(StringUtils.hasText(request.getCompanyWebsite())
                            ? request.getCompanyWebsite().trim()
                            : null)
                    .verifiedStatus("PENDING")
                    .build();

            employerRepository.save(employer);
            return;
        }

        throw new IllegalArgumentException("Invalid role");
    }

    private String trim(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    
}