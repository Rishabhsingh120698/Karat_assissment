package com.example.orbit_order_service.dto;

import com.example.orbit_order_service.model.OrderStatus;

import jakarta.validation.constraints.NotNull;

public class AdminOrderStatusRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    public AdminOrderStatusRequest() {
    }

    public AdminOrderStatusRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}