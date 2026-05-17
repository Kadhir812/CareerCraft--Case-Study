package com.example.backend_careercrafter.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend_careercrafter.dto.notificationDTO.NotificationDTO;
import com.example.backend_careercrafter.exceptions.ResourceNotFoundException;
import com.example.backend_careercrafter.model.Notification;
import com.example.backend_careercrafter.model.User;
import com.example.backend_careercrafter.model.enums.NotificationType;
import com.example.backend_careercrafter.repository.NotificationRepository;
import com.example.backend_careercrafter.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void createNotification(User recipient, NotificationType type, String message, String targetRoute) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .targetRoute(targetRoute)
                .build();

        notificationRepository.save(notification);
        log.info("Created {} notification for user {}", type, recipient.getId());
    }

    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .targetRoute(notification.getTargetRoute())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}