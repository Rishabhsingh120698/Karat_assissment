package com.example.orbit_inventory_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.orbit_inventory_service.dto.InventoryRequest;
import com.example.orbit_inventory_service.dto.InventoryResponse;
import com.example.orbit_inventory_service.dto.StockUpdateRequest;
import com.example.orbit_inventory_service.exception.InsufficientStockException;
import com.example.orbit_inventory_service.exception.InventoryNotFoundException;
import com.example.orbit_inventory_service.model.Inventory;
import com.example.orbit_inventory_service.repository.InventoryRepository;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(
            InventoryRepository inventoryRepository) {

        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public InventoryResponse createInventory(
            InventoryRequest request) {

        if (inventoryRepository.existsByProductId(
                request.getProductId())) {

            throw new IllegalArgumentException(
                    "Inventory already exists for product: "
                    + request.getProductId());
        }

        Inventory inventory = new Inventory();

        inventory.setProductId(
                request.getProductId());

        inventory.setStockQuantity(
                request.getStockQuantity());

        inventory.setReservedQuantity(0);

        inventory.setCreatedAt(
                LocalDateTime.now());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse getInventoryByProductId(
            Long productId) {

        Inventory inventory =
                getInventory(productId);

        return mapToResponse(inventory);
    }

    @Transactional
    public InventoryResponse increaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory =
                getInventory(productId);

        inventory.setStockQuantity(
                inventory.getStockQuantity()
                        + request.getQuantity());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    @Transactional
    public InventoryResponse decreaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory =
                getInventory(productId);

        int availableQuantity =
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity();

        if (request.getQuantity()
                > availableQuantity) {

            throw new InsufficientStockException(
                    "Insufficient available stock for product: "
                    + productId);
        }

        inventory.setStockQuantity(
                inventory.getStockQuantity()
                        - request.getQuantity());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    @Transactional
    public InventoryResponse reserveStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory =
                getInventory(productId);

        int availableQuantity =
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity();

        if (request.getQuantity()
                > availableQuantity) {

            throw new InsufficientStockException(
                    "Insufficient available stock for product: "
                    + productId);
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        + request.getQuantity());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    @Transactional
    public InventoryResponse releaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory =
                getInventory(productId);

        if (request.getQuantity()
                > inventory.getReservedQuantity()) {

            throw new IllegalArgumentException(
                    "Cannot release more than reserved quantity");
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        - request.getQuantity());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    /*
     * Finalize a previously reserved quantity.
     *
     * Example:
     *
     * stockQuantity    = 20
     * reservedQuantity = 3
     *
     * finalize 3
     *
     * stockQuantity    = 17
     * reservedQuantity = 0
     */
    @Transactional
    public InventoryResponse finalizeStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory =
                getInventory(productId);

        if (request.getQuantity()
                > inventory.getReservedQuantity()) {

            throw new IllegalArgumentException(
                    "Cannot finalize more than reserved quantity");
        }

        inventory.setStockQuantity(
                inventory.getStockQuantity()
                        - request.getQuantity());

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        - request.getQuantity());

        inventory.setUpdatedAt(
                LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    private Inventory getInventory(
            Long productId) {

        return inventoryRepository
                .findByProductId(productId)
                .orElseThrow(
                        () -> new InventoryNotFoundException(
                                "Inventory not found for product: "
                                + productId));
    }

    private InventoryResponse mapToResponse(
            Inventory inventory) {

        InventoryResponse response =
                new InventoryResponse();

        response.setId(
                inventory.getId());

        response.setProductId(
                inventory.getProductId());

        response.setStockQuantity(
                inventory.getStockQuantity());

        response.setReservedQuantity(
                inventory.getReservedQuantity());

        response.setAvailableQuantity(
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity());

        response.setCreatedAt(
                inventory.getCreatedAt());

        response.setUpdatedAt(
                inventory.getUpdatedAt());

        return response;
    }
}