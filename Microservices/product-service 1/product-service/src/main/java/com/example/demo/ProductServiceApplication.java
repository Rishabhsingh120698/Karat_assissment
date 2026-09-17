package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;

@SpringBootApplication
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner loadData(ProductRepository repository) {
        return args -> {
            repository.save(new Product(1L, "Laptop", 50000.0, true));
            repository.save(new Product(2L, "Mobile", 25000.0, true));
        };
    }
}