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

    public JwtAuthenticationFilter(JwtService jwtService) {
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

        /*
         * =========================================================
         * PUBLIC AUTH APIs
         * =========================================================
         */

        if (path.equals("/api/auth/login")
                || path.equals("/api/auth/register")) {

            return chain.filter(exchange);
        }

        /*
         * =========================================================
         * PUBLIC PRODUCT CATALOG
         *
         * Customers should be able to browse products before
         * logging in.
         * =========================================================
         */

        if (path.startsWith("/api/products/")
                || path.equals("/api/products")) {

            if (method == HttpMethod.GET) {

                return chain.filter(exchange);
            }
        }

        /*
         * =========================================================
         * READ AUTHORIZATION HEADER
         * =========================================================
         */

        String authorizationHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            return unauthorized(exchange);
        }

        /*
         * =========================================================
         * EXTRACT TOKEN
         * =========================================================
         */

        String token =
                authorizationHeader.substring(7);

        /*
         * =========================================================
         * VALIDATE TOKEN
         * =========================================================
         */

        if (!jwtService.isTokenValid(token)) {

            return unauthorized(exchange);
        }

        /*
         * =========================================================
         * EXTRACT USER INFORMATION
         * =========================================================
         */

        Long userId =
                jwtService.extractUserId(token);

        String username =
                jwtService.extractUsername(token);

        String role =
                jwtService.extractRole(token);

        /*
         * =========================================================
         * BASIC JWT DATA VALIDATION
         * =========================================================
         */

        if (userId == null
                || username == null
                || username.isBlank()
                || role == null
                || role.isBlank()) {

            return unauthorized(exchange);
        }

        /*
         * =========================================================
         * ROLE AUTHORIZATION
         * =========================================================
         */

        if (!isAuthorized(path, method, role)) {

            return forbidden(exchange);
        }

        /*
         * =========================================================
         * CREATE SPRING SECURITY AUTHENTICATION
         * =========================================================
         */

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + role);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(authority)
                );

        /*
         * =========================================================
         * CREATE TRUSTED USER HEADERS
         *
         * First remove anything supplied by the client.
         * Then add values extracted from the validated JWT.
         * =========================================================
         */

        ServerHttpRequest modifiedRequest =
                exchange.getRequest()
                        .mutate()
                        .headers(headers -> {

                            headers.remove("X-USER-ID");
                            headers.remove("X-USER-NAME");
                            headers.remove("X-USER-ROLE");

                            headers.add(
                                    "X-USER-ID",
                                    String.valueOf(userId)
                            );

                            headers.add(
                                    "X-USER-NAME",
                                    username
                            );

                            headers.add(
                                    "X-USER-ROLE",
                                    role
                            );
                        })
                        .build();

        ServerWebExchange modifiedExchange =
                exchange.mutate()
                        .request(modifiedRequest)
                        .build();

        /*
         * =========================================================
         * FORWARD REQUEST
         * =========================================================
         */

        return chain
                .filter(modifiedExchange)
                .contextWrite(
                        ReactiveSecurityContextHolder
                                .withAuthentication(
                                        authentication
                                )
                );
    }

    /*
     * =============================================================
     * ROLE AUTHORIZATION LOGIC
     * =============================================================
     */
    private boolean isAuthorized(
            String path,
            HttpMethod method,
            String role) {

        /*
         * ---------------------------------------------------------
         * ADMIN ONLY - INVENTORY
         * ---------------------------------------------------------
         */

        if (path.startsWith("/api/inventory")) {

            return "ADMIN".equalsIgnoreCase(role);
        }

        /*
         * ---------------------------------------------------------
         * ADMIN ONLY - PRODUCT WRITE OPERATIONS
         * ---------------------------------------------------------
         */

        if (path.startsWith("/api/products")) {

            if (method == HttpMethod.POST
                    || method == HttpMethod.PUT
                    || method == HttpMethod.PATCH
                    || method == HttpMethod.DELETE) {

                return "ADMIN".equalsIgnoreCase(role);
            }

            return true;
        }

        /*
         * ---------------------------------------------------------
         * CUSTOMER + ADMIN - ORDERS
         * ---------------------------------------------------------
         */

        if (path.startsWith("/api/orders")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }

        /*
         * ---------------------------------------------------------
         * CUSTOMER + ADMIN - PAYMENTS
         * ---------------------------------------------------------
         */

        if (path.startsWith("/api/payments")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }

        /*
         * ---------------------------------------------------------
         * CUSTOMER + ADMIN - NOTIFICATIONS
         * ---------------------------------------------------------
         */

        if (path.startsWith("/api/notifications")) {

            return "CUSTOMER".equalsIgnoreCase(role)
                    || "ADMIN".equalsIgnoreCase(role);
        }

        /*
         * ---------------------------------------------------------
         * DEFAULT
         *
         * Valid JWT is enough for other protected endpoints.
         * ---------------------------------------------------------
         */

        return true;
    }

    /*
     * =============================================================
     * 401 UNAUTHORIZED
     * =============================================================
     */
    private Mono<Void> unauthorized(
            ServerWebExchange exchange) {

        exchange.getResponse()
                .setStatusCode(
                        HttpStatus.UNAUTHORIZED);

        return exchange.getResponse()
                .setComplete();
    }

    /*
     * =============================================================
     * 403 FORBIDDEN
     * =============================================================
     */
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