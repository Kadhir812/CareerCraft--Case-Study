package com.example.backend_careercrafter.dto.notificationDTO;



import java.time.LocalDateTime;

import com.example.backend_careercrafter.model.enums.NotificationType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String message;
    private String targetRoute;
    private LocalDateTime createdAt;
}