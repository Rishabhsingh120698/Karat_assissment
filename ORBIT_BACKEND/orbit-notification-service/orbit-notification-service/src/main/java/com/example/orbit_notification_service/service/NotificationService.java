package com.example.orbit_notification_service.service;

import com.example.orbit_notification_service.dto.NotificationRequest;
import com.example.orbit_notification_service.dto.NotificationResponse;
import com.example.orbit_notification_service.exception.NotificationNotFoundException;
import com.example.orbit_notification_service.model.Notification;
import com.example.orbit_notification_service.model.NotificationStatus;
import com.example.orbit_notification_service.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationResponse createNotification(
            NotificationRequest request) {

        Notification notification = new Notification();

        notification.setUserId(request.getUserId());
        notification.setOrderId(request.getOrderId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setStatus(NotificationStatus.PENDING);

        Notification savedNotification =
                notificationRepository.save(notification);

        return mapToResponse(savedNotification);
    }

    public NotificationResponse getNotificationById(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found with id: " + id
                                ));

        return mapToResponse(notification);
    }

    public List<NotificationResponse> getNotificationsByUserId(
            Long userId) {

        return notificationRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<NotificationResponse> getNotificationsByOrderId(
            Long orderId) {

        return notificationRepository
                .findByOrderId(orderId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsSent(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found with id: " + id
                                ));

        notification.setStatus(NotificationStatus.SENT);

        Notification updatedNotification =
                notificationRepository.save(notification);

        return mapToResponse(updatedNotification);
    }

    @Transactional
    public NotificationResponse markAsFailed(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found with id: " + id
                                ));

        notification.setStatus(NotificationStatus.FAILED);

        Notification updatedNotification =
                notificationRepository.save(notification);

        return mapToResponse(updatedNotification);
    }

    private NotificationResponse mapToResponse(
            Notification notification) {

        NotificationResponse response = new NotificationResponse();

        response.setId(notification.getId());
        response.setUserId(notification.getUserId());
        response.setOrderId(notification.getOrderId());
        response.setType(notification.getType());
        response.setMessage(notification.getMessage());
        response.setStatus(notification.getStatus());
        response.setCreatedAt(notification.getCreatedAt());
        response.setUpdatedAt(notification.getUpdatedAt());

        return response;
    }
}