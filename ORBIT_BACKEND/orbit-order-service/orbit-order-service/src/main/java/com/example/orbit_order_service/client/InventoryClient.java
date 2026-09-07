package com.example.orbit_order_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class InventoryClient {

    private final RestClient restClient;

    public InventoryClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8083")
                .build();
    }

    public InventoryResponse getInventory(Long productId) {

        return restClient.get()
                .uri("/api/inventory/{productId}", productId)
                .retrieve()
                .body(InventoryResponse.class);
    }

    public void reserveStock(Long productId, Integer quantity) {

        StockUpdateRequest request =
                new StockUpdateRequest();

        request.setQuantity(quantity);

        restClient.patch()
                .uri("/api/inventory/{productId}/reserve", productId)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    public void releaseStock(Long productId, Integer quantity) {

        StockUpdateRequest request =
                new StockUpdateRequest();

        request.setQuantity(quantity);

        restClient.patch()
                .uri("/api/inventory/{productId}/release", productId)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    public static class StockUpdateRequest {

        private Integer quantity;

        public StockUpdateRequest() {
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class InventoryResponse {

        private Long id;
        private Long productId;
        private Integer stockQuantity;
        private Integer reservedQuantity;
        private Integer availableQuantity;

        public InventoryResponse() {
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
    }
}