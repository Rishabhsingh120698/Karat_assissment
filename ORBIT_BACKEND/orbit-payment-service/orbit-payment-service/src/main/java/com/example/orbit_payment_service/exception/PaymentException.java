package com.example.orbit_payment_service.exception;

public class PaymentException
        extends RuntimeException {

    public PaymentException(String message) {
        super(message);
    }
}