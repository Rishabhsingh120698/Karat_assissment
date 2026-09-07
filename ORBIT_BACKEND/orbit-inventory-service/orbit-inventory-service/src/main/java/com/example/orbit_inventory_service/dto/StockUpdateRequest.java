package com.example.orbit_inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockUpdateRequest {

    @NotNull
    @Min(1)
    private Integer quantity;

    public StockUpdateRequest() {
    }

    public StockUpdateRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}