package com.example.orbit_inventory_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.orbit_inventory_service.dto.InventoryRequest;
import com.example.orbit_inventory_service.dto.InventoryResponse;
import com.example.orbit_inventory_service.dto.StockUpdateRequest;
import com.example.orbit_inventory_service.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody InventoryRequest request) {

        InventoryResponse response =
                inventoryService.createInventory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {

        return ResponseEntity.ok(
                inventoryService.getAllInventory()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse> getInventory(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                inventoryService.getInventoryByProductId(productId)
        );
    }

    @PatchMapping("/{productId}/increase")
    public ResponseEntity<InventoryResponse> increaseStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                inventoryService.increaseStock(
                        productId,
                        request
                )
        );
    }

    @PatchMapping("/{productId}/decrease")
    public ResponseEntity<InventoryResponse> decreaseStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                inventoryService.decreaseStock(
                        productId,
                        request
                )
        );
    }

    @PatchMapping("/{productId}/reserve")
    public ResponseEntity<InventoryResponse> reserveStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                inventoryService.reserveStock(
                        productId,
                        request
                )
        );
    }

    @PatchMapping("/{productId}/release")
    public ResponseEntity<InventoryResponse> releaseStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                inventoryService.releaseStock(
                        productId,
                        request
                )
        );
    }
}