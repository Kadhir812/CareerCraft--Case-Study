package com.example.backend_careercrafter.repository;

import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend_careercrafter.model.Notification;
import com.example.backend_careercrafter.model.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("select n from Notification n where n.recipient = :recipient order by n.createdAt desc")
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}