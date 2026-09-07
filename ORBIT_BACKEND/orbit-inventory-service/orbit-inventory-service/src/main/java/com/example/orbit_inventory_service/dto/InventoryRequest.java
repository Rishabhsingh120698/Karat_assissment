package com.example.orbit_inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class InventoryRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    public InventoryRequest() {
    }

    public InventoryRequest(Long productId, Integer stockQuantity) {
        this.productId = productId;
        this.stockQuantity = stockQuantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}