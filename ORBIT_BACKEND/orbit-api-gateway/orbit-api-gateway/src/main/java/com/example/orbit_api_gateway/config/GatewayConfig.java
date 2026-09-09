package com.example.orbit_api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(
            RouteLocatorBuilder builder) {

        return builder.routes()

                /*
                 * =====================================================
                 * AUTH SERVICE
                 * =====================================================
                 *
                 * Gateway:
                 * http://localhost:9191/api/auth/**
                 *
                 * Auth Service:
                 * http://localhost:8081/api/auth/**
                 */
                .route("auth-service", route -> route
                        .path("/api/auth/**")
                        .uri("lb://ORBIT-AUTH-SERVICE")
                )

                /*
                 * =====================================================
                 * PRODUCT API
                 * =====================================================
                 *
                 * Product APIs are currently still inside the
                 * original orbit-backend application running on 8080.
                 *
                 * Therefore we use a direct URL instead of Eureka.
                 *
                 * Gateway:
                 * http://localhost:9191/api/products/**
                 *
                 * Product Service:
                 * http://localhost:8080/api/products/**
                 */
                .route("product-service", route -> route
                        .path("/api/products/**")
                        .uri("http://localhost:8080")
                )

                /*
                 * =====================================================
                 * ORDER SERVICE
                 * =====================================================
                 */
                .route("order-service", route -> route
                        .path("/api/orders/**")
                        .uri("lb://ORBIT-ORDER-SERVICE")
                )

                /*
                 * =====================================================
                 * INVENTORY SERVICE
                 * =====================================================
                 */
                .route("inventory-service", route -> route
                        .path("/api/inventory/**")
                        .uri("lb://ORBIT-INVENTORY-SERVICE")
                )

                /*
                 * =====================================================
                 * PAYMENT SERVICE
                 * =====================================================
                 */
                .route("payment-service", route -> route
                        .path("/api/payments/**")
                        .uri("lb://ORBIT-PAYMENT-SERVICE")
                )

                /*
                 * =====================================================
                 * NOTIFICATION SERVICE
                 * =====================================================
                 */
                .route("notification-service", route -> route
                        .path("/api/notifications/**")
                        .uri("lb://ORBIT-NOTIFICATION-SERVICE")
                )

                .build();
    }
}