package com.example.orbit_api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;

import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http) {

        return http
                /*
                 * CSRF is not required for our stateless
                 * REST APIs using JWT.
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 * We are not using browser form login.
                 */
                .formLogin(formLogin -> formLogin.disable())

                /*
                 * We are not using HTTP Basic authentication.
                 */
                .httpBasic(httpBasic -> httpBasic.disable())

                /*
                 * We are not using Gateway logout/session.
                 */
                .logout(logout -> logout.disable())

                .authorizeExchange(exchange -> exchange

                        /*
                         * Registration and login are public.
                         */
                        .pathMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        /*
                         * IMPORTANT:
                         *
                         * JWT authentication is handled by our
                         * custom JwtAuthenticationFilter.
                         *
                         * Therefore Spring Security itself should
                         * not reject the request before our custom
                         * Gateway filter processes it.
                         */
                        .anyExchange().permitAll()
                )

                .build();
    }
}