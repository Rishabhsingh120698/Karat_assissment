package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;

@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner loadData(OrderRepository repository) {
        return args -> {
            repository.save(new Order(1L, "Laptop", 50000.0, true));
            repository.save(new Order(2L, "Mobile", 25000.0, true));
        };
    }
}