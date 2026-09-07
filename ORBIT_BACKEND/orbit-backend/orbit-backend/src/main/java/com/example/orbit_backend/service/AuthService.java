package com.example.orbit_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.orbit_backend.dto.LoginRequest;
import com.example.orbit_backend.dto.UserRegistrationRequest;
import com.example.orbit_backend.exception.DuplicateResourceException;
import com.example.orbit_backend.exception.ResourceNotFoundException;
import com.example.orbit_backend.model.User;
import com.example.orbit_backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException(
                    "Username already exists: " + request.getUsername()
            );
        }

        User user = new User();

        user.setUsername(request.getUsername());

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(hashedPassword);

        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    public String loginUser(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with username: "
                                        + request.getUsername()
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid username or password"
            );
        }

        return jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );
    }
}