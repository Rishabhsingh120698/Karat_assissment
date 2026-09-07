package com.example.orbit_payment_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.orbit_payment_service.dto.PaymentRequest;
import com.example.orbit_payment_service.dto.PaymentResponse;
import com.example.orbit_payment_service.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response =
                paymentService.createPayment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id)
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrder(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(orderId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByUser(userId)
        );
    }

    @PatchMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.refundPayment(id)
        );
    }
}