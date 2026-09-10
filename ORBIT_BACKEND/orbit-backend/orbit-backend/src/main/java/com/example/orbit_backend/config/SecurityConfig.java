package com.example.orbit_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

            // ------------------------------------
            // CSRF
            // ------------------------------------

            .csrf(csrf -> csrf.disable())

            // ------------------------------------
            // SESSION MANAGEMENT
            // ------------------------------------

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // ------------------------------------
            // DISABLE BASIC AUTHENTICATION
            // ------------------------------------

            .httpBasic(httpBasic ->
                    httpBasic.disable()
            )

            // ------------------------------------
            // DISABLE FORM LOGIN
            // ------------------------------------

            .formLogin(formLogin ->
                    formLogin.disable()
            )

            // ------------------------------------
            // AUTHORIZATION RULES
            // ------------------------------------

            .authorizeHttpRequests(auth -> auth

                // --------------------------------
                // PUBLIC AUTH APIs
                // --------------------------------

                .requestMatchers(
                        "/api/auth/register"
                )
                .permitAll()

                .requestMatchers(
                        "/api/auth/login"
                )
                .permitAll()

                // --------------------------------
                // PUBLIC PRODUCT GET APIs
                // --------------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/products",
                        "/api/products/**"
                )
                .permitAll()

                // --------------------------------
                // ADMIN PRODUCT APIs
                // --------------------------------

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/products"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.PATCH,
                        "/api/products/**"
                )
                .hasRole("ADMIN")

                // --------------------------------
                // EVERYTHING ELSE
                // --------------------------------

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