package com.example.orbit_notification_service.controller;

import com.example.orbit_notification_service.dto.NotificationRequest;
import com.example.orbit_notification_service.dto.NotificationResponse;
import com.example.orbit_notification_service.service.NotificationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request) {

        NotificationResponse response =
                notificationService.createNotification(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @PathVariable Long id) {

        NotificationResponse response =
                notificationService.getNotificationById(id);

        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id) {

        NotificationResponse response =
                notificationService.markAsRead(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByUserId(
            @PathVariable Long userId) {

        List<NotificationResponse> notifications =
                notificationService.getNotificationsByUserId(userId);

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByOrderId(
            @PathVariable Long orderId) {

        List<NotificationResponse> notifications =
                notificationService.getNotificationsByOrderId(orderId);

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/sent")
    public ResponseEntity<NotificationResponse> markAsSent(
            @PathVariable Long id) {

        NotificationResponse response =
                notificationService.markAsSent(id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/failed")
    public ResponseEntity<NotificationResponse> markAsFailed(
            @PathVariable Long id) {

        NotificationResponse response =
                notificationService.markAsFailed(id);

        return ResponseEntity.ok(response);
    }
}