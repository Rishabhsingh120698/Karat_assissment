package com.example.orbit_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.orbit_backend.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                // ------------------------------------
                // PUBLIC APIs
                // ------------------------------------

                // Registration
                .requestMatchers("/api/auth/register")
                .permitAll()

                // Login
                .requestMatchers("/api/auth/login")
                .permitAll()

                // Product GET APIs
                .requestMatchers(
                        org.springframework.http.HttpMethod.GET,
                        "/api/products",
                        "/api/products/**"
                )
                .permitAll()

                // ------------------------------------
                // ADMIN APIs
                // ------------------------------------

                // Create product
                .requestMatchers(
                        org.springframework.http.HttpMethod.POST,
                        "/api/products"
                )
                .hasRole("ADMIN")

                // Update product
                .requestMatchers(
                        org.springframework.http.HttpMethod.PUT,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                // Delete product
                .requestMatchers(
                        org.springframework.http.HttpMethod.DELETE,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                // Activate / deactivate product
                .requestMatchers(
                        org.springframework.http.HttpMethod.PATCH,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest()
                .authenticated()
            )

            // ------------------------------------
            // JWT FILTER
            // ------------------------------------

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}