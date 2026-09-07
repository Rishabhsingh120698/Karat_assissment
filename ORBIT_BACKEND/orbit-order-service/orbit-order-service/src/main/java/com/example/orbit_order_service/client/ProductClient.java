package com.example.orbit_order_service.client;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ProductClient {

    private final RestClient restClient;

    public ProductClient() {

        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8080")
                .build();
    }

    public ProductResponse getProduct(Long productId) {

        return restClient.get()
                .uri("/api/products/{id}", productId)
                .retrieve()
                .body(ProductResponse.class);
    }

    public static class ProductResponse {

        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String category;
        private Integer stockQuantity;
        private String imageUrl;
        private Boolean active;
        private String createdAt;
        private String updatedAt;

        public ProductResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(String updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
}