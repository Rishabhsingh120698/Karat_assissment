package com.example.orbit_payment_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.orbit_payment_service.dto.PaymentRequest;
import com.example.orbit_payment_service.dto.PaymentResponse;
import com.example.orbit_payment_service.exception.PaymentException;
import com.example.orbit_payment_service.exception.PaymentNotFoundException;
import com.example.orbit_payment_service.model.Payment;
import com.example.orbit_payment_service.model.PaymentStatus;
import com.example.orbit_payment_service.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(
            PaymentRepository paymentRepository) {

        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public PaymentResponse createPayment(
            PaymentRequest request) {

        /*
         * Only one payment should normally exist
         * for an order in our first implementation.
         */
        if (paymentRepository
                .findByOrderId(request.getOrderId())
                .isPresent()) {

            throw new PaymentException(
                    "Payment already exists for order id: "
                            + request.getOrderId()
            );
        }

        Payment payment = new Payment();

        payment.setPaymentReference(
                generatePaymentReference()
        );

        payment.setOrderId(
                request.getOrderId()
        );

        payment.setUserId(
                request.getUserId()
        );

        payment.setAmount(
                request.getAmount()
        );

        payment.setPaymentMethod(
                request.getPaymentMethod()
        );

        /*
         * Mock payment processing.
         *
         * For now we assume payment succeeds.
         */
        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setCreatedAt(
                LocalDateTime.now()
        );

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        return convertToResponse(savedPayment);
    }

    public PaymentResponse getPaymentById(
            Long paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        return convertToResponse(payment);
    }

    public PaymentResponse getPaymentByOrderId(
            Long orderId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found for order id: "
                                                + orderId
                                )
                        );

        return convertToResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByUser(
            Long userId) {

        return paymentRepository
                .findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse refundPayment(
            Long paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        if (payment.getStatus()
                != PaymentStatus.SUCCESS) {

            throw new PaymentException(
                    "Only successful payments can be refunded"
            );
        }

        payment.setStatus(
                PaymentStatus.REFUNDED
        );

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        Payment updatedPayment =
                paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    private String generatePaymentReference() {

        return "PAY-"
                + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private PaymentResponse convertToResponse(
            Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getPaymentReference(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}