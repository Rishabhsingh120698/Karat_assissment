package com.example.orbit_order_service.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public class OrderRequest {

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(List<OrderItemRequest> items) {
        this.items = items;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}