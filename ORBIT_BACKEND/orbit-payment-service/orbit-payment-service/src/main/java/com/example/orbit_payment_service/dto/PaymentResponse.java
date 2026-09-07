package com.example.orbit_payment_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.orbit_payment_service.model.PaymentStatus;

public class PaymentResponse {

    private Long id;

    private String paymentReference;

    private Long orderId;

    private Long userId;

    private BigDecimal amount;

    private String paymentMethod;

    private PaymentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id,
                           String paymentReference,
                           Long orderId,
                           Long userId,
                           BigDecimal amount,
                           String paymentMethod,
                           PaymentStatus status,
                           LocalDateTime createdAt,
                           LocalDateTime updatedAt) {

        this.id = id;
        this.paymentReference = paymentReference;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}