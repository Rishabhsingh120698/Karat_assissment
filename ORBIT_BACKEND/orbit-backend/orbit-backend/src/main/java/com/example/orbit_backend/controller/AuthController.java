package com.example.orbit_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.orbit_backend.dto.AuthResponse;
import com.example.orbit_backend.dto.LoginRequest;
import com.example.orbit_backend.dto.UserRegistrationRequest;
import com.example.orbit_backend.model.User;
import com.example.orbit_backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody UserRegistrationRequest request) {

        User user = authService.registerUser(request);

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.loginUser(request);

        return ResponseEntity.ok(token);
    }
}