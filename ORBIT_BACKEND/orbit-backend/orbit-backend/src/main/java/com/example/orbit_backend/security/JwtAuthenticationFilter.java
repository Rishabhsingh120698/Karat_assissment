package com.example.orbit_backend.security;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import com.example.orbit_backend.service.JwtService;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        String token =
                authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        String username =
                jwtService.extractUsername(token);

        String role =
                jwtService.extractRole(token);

        // =========================================================
        // NORMALIZE ROLE
        // =========================================================

        role = normalizeRole(role);

        if (username == null
                || username.isBlank()
                || role == null
                || role.isBlank()) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        // =========================================================
        // CREATE AUTHORITY
        // =========================================================

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + role);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(authority));

        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        authentication);

        filterChain.doFilter(
                request,
                response);
    }

    // =============================================================
    // NORMALIZE ROLE
    // =============================================================

    private String normalizeRole(String role) {

        if (role == null) {

            return null;
        }

        role = role.trim();

        if (role.startsWith("ROLE_")) {

            role = role.substring(5);
        }

        return role.toUpperCase();
    }
}