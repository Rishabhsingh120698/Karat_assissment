package com.example.orbit_api_gateway.security;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;



@Component
public class JwtAuthenticationFilter
        implements GlobalFilter, Ordered {


    private final JwtService jwtService;


    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }


    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {


        String path =
                exchange.getRequest()
                        .getURI()
                        .getPath();


        HttpMethod method =
                exchange.getRequest()
                        .getMethod();


        // =========================================================
        // PUBLIC AUTH APIs
        // =========================================================

        if (path.equals("/api/auth/login")
                || path.equals("/api/auth/register")) {

            return chain.filter(exchange);
        }


        // =========================================================
        // PUBLIC PRODUCT CATALOG
        // =========================================================

        if (path.startsWith("/api/products/")
                || path.equals("/api/products")) {

            if (method == HttpMethod.GET) {

                return chain.filter(exchange);
            }
        }


        // =========================================================
        // READ INVENTORY
        // =========================================================
        //
        // Customers and Admins are allowed to VIEW inventory.
        //
        // Example:
        //
        // GET /api/inventory
        // GET /api/inventory/2
        //
        // Both CUSTOMER and ADMIN are allowed.
        //
        // =========================================================

        if (path.startsWith("/api/inventory")) {

            if (method == HttpMethod.GET) {

                return chain.filter(exchange);
            }
        }


        // =========================================================
        // READ AUTHORIZATION HEADER
        // =========================================================

        String authorizationHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(
                                HttpHeaders.AUTHORIZATION);


        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            return unauthorized(exchange);
        }


        // =========================================================
        // EXTRACT TOKEN
        // =========================================================

        String token =
                authorizationHeader.substring(7);


        // =========================================================
        // VALIDATE TOKEN
        // =========================================================

        if (!jwtService.isTokenValid(token)) {

            return unauthorized(exchange);
        }


        // =========================================================
        // EXTRACT USER INFORMATION
        // =========================================================

        Long userId =
                jwtService.extractUserId(token);


        String username =
                jwtService.extractUsername(token);


        String extractedRole =
                jwtService.extractRole(token);


        // =========================================================
        // NORMALIZE ROLE
        // =========================================================

        String role =
                normalizeRole(extractedRole);


        // =========================================================
        // BASIC JWT DATA VALIDATION
        // =========================================================

        if (userId == null
                || username == null
                || username.isBlank()
                || role == null
                || role.isBlank()) {

            return unauthorized(exchange);
        }


        // =========================================================
        // ROLE AUTHORIZATION
        // =========================================================

        if (!isAuthorized(
                path,
                method,
                role)) {

            return forbidden(exchange);
        }


        // =========================================================
        // CREATE SPRING SECURITY AUTHENTICATION
        // =========================================================

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + role);


        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(authority));


        // =========================================================
        // CREATE TRUSTED USER HEADERS
        // =========================================================

        ServerHttpRequest modifiedRequest =
                exchange.getRequest()
                        .mutate()
                        .headers(headers -> {

                            headers.remove(
                                    "X-USER-ID");

                            headers.remove(
                                    "X-USER-NAME");

                            headers.remove(
                                    "X-USER-ROLE");


                            headers.add(
                                    "X-USER-ID",
                                    String.valueOf(userId));


                            headers.add(
                                    "X-USER-NAME",
                                    username);


                            headers.add(
                                    "X-USER-ROLE",
                                    role);

                        })
                        .build();


        ServerWebExchange modifiedExchange =
                exchange.mutate()
                        .request(modifiedRequest)
                        .build();


        // =========================================================
        // FORWARD REQUEST
        // =========================================================

        return chain
                .filter(modifiedExchange)
                .contextWrite(
                        ReactiveSecurityContextHolder
                                .withAuthentication(
                                        authentication));
    }


    // =============================================================
    // NORMALIZE ROLE
    // =============================================================

    private String normalizeRole(
            String role) {


        if (role == null) {

            return null;
        }


        String normalizedRole =
                role.trim();


        if (normalizedRole.startsWith("ROLE_")) {

            normalizedRole =
                    normalizedRole.substring(5);
        }


        return normalizedRole.toUpperCase();
    }


    // =============================================================
    // ROLE AUTHORIZATION LOGIC
    // =============================================================

    private boolean isAuthorized(
            String path,
            HttpMethod method,
            String role) {


        // ---------------------------------------------------------
        // INVENTORY
        // ---------------------------------------------------------
        //
        // READ operations:
        //
        // GET /api/inventory
        // GET /api/inventory/{productId}
        //
        // are handled above and don't require a JWT.
        //
        // WRITE operations require ADMIN.
        //
        // ---------------------------------------------------------

        if (path.startsWith("/api/inventory")) {

            if (method == HttpMethod.POST
                    || method == HttpMethod.PUT
                    || method == HttpMethod.PATCH
                    || method == HttpMethod.DELETE) {

                return "ADMIN".equalsIgnoreCase(role);
            }


            return true;
        }


        // ---------------------------------------------------------
        // ADMIN ONLY - PRODUCT WRITE OPERATIONS
        // ---------------------------------------------------------

        if (path.startsWith("/api/products")) {

            if (method == HttpMethod.POST
                    || method == HttpMethod.PUT
                    || method == HttpMethod.PATCH
                    || method == HttpMethod.DELETE) {

                return "ADMIN".equalsIgnoreCase(role);
            }


            return true;
        }


        // ---------------------------------------------------------
        // ADMIN ONLY - ADMIN ORDER OPERATIONS
        // ---------------------------------------------------------

        if (path.equals("/api/orders/admin")) {

            return "ADMIN".equalsIgnoreCase(role);
        }


        if (path.matches(
                "/api/orders/[0-9]+/status")) {

            return "ADMIN".equalsIgnoreCase(role);
        }


        // ---------------------------------------------------------
        // CUSTOMER + ADMIN - ORDERS
        // ---------------------------------------------------------

        if (path.startsWith("/api/orders")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }


        // ---------------------------------------------------------
        // CUSTOMER + ADMIN - PAYMENTS
        // ---------------------------------------------------------

        if (path.startsWith("/api/payments")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }


        // ---------------------------------------------------------
        // CUSTOMER + ADMIN - NOTIFICATIONS
        // ---------------------------------------------------------

        if (path.startsWith("/api/notifications")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }


        // ---------------------------------------------------------
        // DEFAULT
        // ---------------------------------------------------------

        return true;
    }


    // =============================================================
    // 401 UNAUTHORIZED
    // =============================================================

    private Mono<Void> unauthorized(
            ServerWebExchange exchange) {


        exchange.getResponse()
                .setStatusCode(
                        HttpStatus.UNAUTHORIZED);


        return exchange.getResponse()
                .setComplete();
    }


    // =============================================================
    // 403 FORBIDDEN
    // =============================================================

    private Mono<Void> forbidden(
            ServerWebExchange exchange) {


        exchange.getResponse()
                .setStatusCode(
                        HttpStatus.FORBIDDEN);


        return exchange.getResponse()
                .setComplete();
    }


    @Override
    public int getOrder() {

        return -100;
    }
}