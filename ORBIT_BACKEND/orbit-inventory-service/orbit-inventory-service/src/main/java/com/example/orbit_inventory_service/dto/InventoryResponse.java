package com.example.orbit_inventory_service.dto;

import java.time.LocalDateTime;

public class InventoryResponse {

    private Long id;
    private Long productId;
    private Integer stockQuantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InventoryResponse() {
    }

    public InventoryResponse(Long id,
                             Long productId,
                             Integer stockQuantity,
                             Integer reservedQuantity,
                             Integer availableQuantity,
                             LocalDateTime createdAt,
                             LocalDateTime updatedAt) {

        this.id = id;
        this.productId = productId;
        this.stockQuantity = stockQuantity;
        this.reservedQuantity = reservedQuantity;
        this.availableQuantity = availableQuantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getReservedQuantity() {
        return reservedQuantity;
    }

    public void setReservedQuantity(Integer reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
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