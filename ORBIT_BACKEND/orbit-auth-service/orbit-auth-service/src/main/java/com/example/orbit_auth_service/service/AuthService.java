package com.example.orbit_auth_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.orbit_auth_service.dto.AuthResponse;
import com.example.orbit_auth_service.dto.LoginRequest;
import com.example.orbit_auth_service.dto.RegisterRequest;
import com.example.orbit_auth_service.dto.RegisterResponse;
import com.example.orbit_auth_service.exception.AuthException;
import com.example.orbit_auth_service.model.User;
import com.example.orbit_auth_service.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {

            throw new AuthException(
                    "Username already exists: "
                            + request.getUsername());
        }

        User user = new User();

        user.setUsername(request.getUsername());

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(encodedPassword);

        user.setRole("CUSTOMER");

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole(),
                "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new AuthException(
                                "Invalid username or password"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        if (!passwordMatches) {

            throw new AuthException(
                    "Invalid username or password");
        }

        /*
         * JWT now contains:
         *
         * userId   -> database ID
         * username -> username
         * role     -> CUSTOMER / ADMIN
         */
        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername(),
                user.getRole());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole());
    }
}