package com.example.backend_careercrafter.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employer")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Pk_employerID")
    private long id;

    @OneToOne(optional = false)  // One user account → One job seeker profile

    @JoinColumn(name = "FK_userID", nullable = false, unique = true)
    private User user;

    @Column(name = "contactFirstName")
    private String contactFirstName;

    @Column(name = "contactLastName")
    private String contactLastName;

    @Column(name = "companyName", nullable = false)
    private String companyName;

    @Column(name = "industry")
    private String industry;

    @Column(name = "website")
    private String website;

    @Column(name = "verifiedStatus", nullable = false)
    private String verifiedStatus;
}
