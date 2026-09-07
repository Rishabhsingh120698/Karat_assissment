package com.example.orbit_order_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8085")
                .build();
    }

    public NotificationResponse createNotification(
            Long userId,
            Long orderId,
            String type,
            String message) {

        NotificationRequest request = new NotificationRequest();

        request.setUserId(userId);
        request.setOrderId(orderId);
        request.setType(type);
        request.setMessage(message);

        return restClient.post()
                .uri("/api/notifications")
                .body(request)
                .retrieve()
                .body(NotificationResponse.class);
    }

    public static class NotificationRequest {

        private Long userId;
        private Long orderId;
        private String type;
        private String message;

        public NotificationRequest() {
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class NotificationResponse {

        private Long id;
        private Long userId;
        private Long orderId;
        private String type;
        private String message;
        private String status;

        public NotificationResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}