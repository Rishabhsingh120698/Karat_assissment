package com.example.orbit_order_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;

@Component
public class PaymentClient {

    private final RestClient restClient;

    public PaymentClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8084")
                .build();
    }

    public PaymentResponse createPayment(
            Long orderId,
            Long userId,
            BigDecimal amount,
            String paymentMethod) {

        PaymentRequest request = new PaymentRequest();

        request.setOrderId(orderId);
        request.setUserId(userId);
        request.setAmount(amount);
        request.setPaymentMethod(paymentMethod);

        return restClient.post()
                .uri("/api/payments")
                .body(request)
                .retrieve()
                .body(PaymentResponse.class);
    }

    public PaymentResponse getPaymentByOrderId(
            Long orderId) {

        return restClient.get()
                .uri("/api/payments/order/{orderId}", orderId)
                .retrieve()
                .body(PaymentResponse.class);
    }

    public PaymentResponse refundPayment(Long paymentId) {

        return restClient.patch()
                .uri("/api/payments/{id}/refund", paymentId)
                .retrieve()
                .body(PaymentResponse.class);
    }

    public static class PaymentRequest {

        private Long orderId;
        private Long userId;
        private BigDecimal amount;
        private String paymentMethod;

        public PaymentRequest() {
        }

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }

    public static class PaymentResponse {

        private Long id;
        private String paymentReference;
        private Long orderId;
        private Long userId;
        private BigDecimal amount;
        private String paymentMethod;
        private String status;

        public PaymentResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getPaymentReference() {
            return paymentReference;
        }

        public void setPaymentReference(String paymentReference) {
            this.paymentReference = paymentReference;
        }

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}