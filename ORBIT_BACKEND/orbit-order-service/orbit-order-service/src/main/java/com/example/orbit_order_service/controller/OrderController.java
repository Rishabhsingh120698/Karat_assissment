package com.example.orbit_order_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.orbit_order_service.dto.OrderRequest;
import com.example.orbit_order_service.dto.OrderResponse;
import com.example.orbit_order_service.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            @RequestHeader("X-USER-ID") Long userId) {

        OrderResponse response =
                orderService.createOrder(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-USER-ID") Long userId) {

        List<OrderResponse> responses =
                orderService.getOrdersByUser(userId);

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id) {

        OrderResponse response =
                orderService.getOrderById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(
            @PathVariable String orderNumber) {

        OrderResponse response =
                orderService.getOrderByNumber(orderNumber);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("X-USER-ID") Long userId) {

        OrderResponse response =
                orderService.cancelOrder(userId, id);

        return ResponseEntity.ok(response);
    }
}