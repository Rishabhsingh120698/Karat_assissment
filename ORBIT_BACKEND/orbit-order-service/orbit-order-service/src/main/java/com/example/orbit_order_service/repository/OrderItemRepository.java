package com.example.orbit_order_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.orbit_order_service.model.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    void deleteByOrderId(Long orderId);
}