package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.client.ProductClient;
import com.example.demo.dto.ProductResponse;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final ProductClient productClient;

    public OrderService(OrderRepository repository,
                        ProductClient productClient) {
        this.repository = repository;
        this.productClient = productClient;
    }

    public List<Order> getAllProducts() {
        return repository.findAll();
    }

    public Order getProduct(Long id) {
        return repository.findById(id).orElse(null);
    }

    public ProductResponse getProductFromProductService(Long id) {
        return productClient.getProductById(id);
    }
}