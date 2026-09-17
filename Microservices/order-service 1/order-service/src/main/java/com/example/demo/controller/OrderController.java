package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.client.ProductClient;
import com.example.demo.dto.ProductResponse;
import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @Autowired
    private ProductClient productClient;

    @GetMapping
    public List<Order> getProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Order getProduct(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @GetMapping("/test/{id}")
    public ProductResponse testFeign(@PathVariable Long id) {
        return service.getProductFromProductService(id);
    }

    @CircuitBreaker(name = "productService", fallbackMethod = "fallbackOrder")
    @GetMapping("/feign/{id}")
    public ProductResponse getProductWithCircuitBreaker(@PathVariable Long id) {

        return productClient.getProductById(id);
    }

    public ProductResponse fallbackOrder(Long id, Exception ex) {

        ProductResponse product = new ProductResponse();

        product.setId(0L);
        product.setName("SERVICE UNAVAILABLE");
        product.setPrice(0.0);
        product.setAvailable(false);

        return product;
    }
}