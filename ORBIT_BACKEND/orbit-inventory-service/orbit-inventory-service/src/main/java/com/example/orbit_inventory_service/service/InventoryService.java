package com.example.orbit_inventory_service.service;

import java.util.ArrayList;
import java.util.List;

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

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public InventoryResponse createInventory(InventoryRequest request) {

        if (inventoryRepository.existsByProductId(request.getProductId())) {

            throw new IllegalStateException(
                    "Inventory already exists for product id: "
                            + request.getProductId()
            );
        }

        Inventory inventory = new Inventory();

        inventory.setProductId(request.getProductId());
        inventory.setStockQuantity(request.getStockQuantity());
        inventory.setReservedQuantity(0);

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(savedInventory);
    }

    public InventoryResponse getInventoryByProductId(Long productId) {

        Inventory inventory = inventoryRepository
                .findByProductId(productId)
                .orElseThrow(() ->
                        new InventoryNotFoundException(
                                "Inventory not found for product id: "
                                        + productId
                        )
                );

        return convertToResponse(inventory);
    }

    public List<InventoryResponse> getAllInventory() {

        List<Inventory> inventories =
                inventoryRepository.findAll();

        List<InventoryResponse> responses =
                new ArrayList<>();

        for (Inventory inventory : inventories) {

            responses.add(convertToResponse(inventory));
        }

        return responses;
    }

    @Transactional
    public InventoryResponse increaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory = getInventory(productId);

        int newStock =
                inventory.getStockQuantity()
                        + request.getQuantity();

        inventory.setStockQuantity(newStock);

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    @Transactional
    public InventoryResponse decreaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory = getInventory(productId);

        int availableQuantity =
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity();

        if (request.getQuantity() > availableQuantity) {

            throw new InsufficientStockException(
                    "Insufficient stock for product id: "
                            + productId
                            + ". Available quantity: "
                            + availableQuantity
            );
        }

        inventory.setStockQuantity(
                inventory.getStockQuantity()
                        - request.getQuantity()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    @Transactional
    public InventoryResponse reserveStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory = getInventory(productId);

        int availableQuantity =
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity();

        if (request.getQuantity() > availableQuantity) {

            throw new InsufficientStockException(
                    "Insufficient stock for product id: "
                            + productId
                            + ". Available quantity: "
                            + availableQuantity
            );
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        + request.getQuantity()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    @Transactional
    public InventoryResponse releaseStock(
            Long productId,
            StockUpdateRequest request) {

        Inventory inventory = getInventory(productId);

        if (request.getQuantity()
                > inventory.getReservedQuantity()) {

            throw new IllegalStateException(
                    "Cannot release more stock than reserved"
            );
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        - request.getQuantity()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    private Inventory getInventory(Long productId) {

        return inventoryRepository
                .findByProductId(productId)
                .orElseThrow(() ->
                        new InventoryNotFoundException(
                                "Inventory not found for product id: "
                                        + productId
                        )
                );
    }

    private InventoryResponse convertToResponse(
            Inventory inventory) {

        int availableQuantity =
                inventory.getStockQuantity()
                        - inventory.getReservedQuantity();

        return new InventoryResponse(
                inventory.getId(),
                inventory.getProductId(),
                inventory.getStockQuantity(),
                inventory.getReservedQuantity(),
                availableQuantity,
                inventory.getCreatedAt(),
                inventory.getUpdatedAt()
        );
    }
}