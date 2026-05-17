package com.example.backend_careercrafter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend_careercrafter.model.Application;

import java.util.List;
import java.util.Optional;



@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("select case when count(a) > 0 then true else false end " +
            "from Application a " +
            "where a.job.id = :jobId and a.seeker.id = :seekerId")
    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);

    @Query("select case when count(a) > 0 then true else false end " +
       "from Application a " +
       "where a.seeker.id = :seekerId and a.job.employer.id = :employerId")
    boolean existsBySeekerIdAndJobEmployerId(Long seekerId, Long employerId);

    List<Application> findBySeekerId(Long seekerId);

    List<Application> findByJobId(Long jobId);

    Optional<Application> findByIdAndJobId(Long appId, Long jobId);
}