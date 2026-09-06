package com.example.orbit_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.orbit_backend.dto.ProductRequest;
import com.example.orbit_backend.dto.ProductResponse;
import com.example.orbit_backend.exception.ResourceNotFoundException;
import com.example.orbit_backend.model.Product;
import com.example.orbit_backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        return convertToResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        if (request.getActive() == null) {
            product.setActive(true);
        } else {
            product.setActive(request.getActive());
        }

        Product savedProduct = productRepository.save(product);

        return convertToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setStockQuantity(request.getStockQuantity());
        existingProduct.setImageUrl(request.getImageUrl());

        if (request.getActive() != null) {
            existingProduct.setActive(request.getActive());
        }

        Product updatedProduct = productRepository.save(existingProduct);

        return convertToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        productRepository.delete(existingProduct);
    }

    public List<ProductResponse> searchProducts(String name) {

        return productRepository
                .findByNameContainingIgnoreCaseAndActiveTrue(name)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(String category) {

        return productRepository
                .findByCategoryIgnoreCaseAndActiveTrue(category)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse activateProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        product.setActive(true);

        Product updatedProduct = productRepository.save(product);

        return convertToResponse(updatedProduct);
    }

    public ProductResponse deactivateProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        product.setActive(false);

        Product updatedProduct = productRepository.save(product);

        return convertToResponse(updatedProduct);
    }

    private ProductResponse convertToResponse(Product product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getStockQuantity(),
                product.getImageUrl(),
                product.getActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}