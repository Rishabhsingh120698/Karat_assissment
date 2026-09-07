package com.example.orbit_payment_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.orbit_payment_service.model.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(
            String paymentReference
    );

    Optional<Payment> findByOrderId(Long orderId);

    List<Payment> findByUserId(Long userId);
}