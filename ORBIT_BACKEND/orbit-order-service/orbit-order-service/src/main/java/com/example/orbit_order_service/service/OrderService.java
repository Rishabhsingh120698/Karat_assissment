package com.example.orbit_order_service.service;

import com.example.orbit_order_service.client.InventoryClient;
import com.example.orbit_order_service.client.NotificationClient;
import com.example.orbit_order_service.client.PaymentClient;
import com.example.orbit_order_service.client.ProductClient;
import com.example.orbit_order_service.dto.OrderItemRequest;
import com.example.orbit_order_service.dto.OrderItemResponse;
import com.example.orbit_order_service.dto.OrderRequest;
import com.example.orbit_order_service.dto.OrderResponse;
import com.example.orbit_order_service.exception.OrderNotFoundException;
import com.example.orbit_order_service.model.Order;
import com.example.orbit_order_service.model.OrderItem;
import com.example.orbit_order_service.model.OrderStatus;
import com.example.orbit_order_service.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    private final InventoryClient inventoryClient;

    private final ProductClient productClient;

    private final PaymentClient paymentClient;

    private final NotificationClient notificationClient;

    public OrderService(
            OrderRepository orderRepository,
            InventoryClient inventoryClient,
            ProductClient productClient,
            PaymentClient paymentClient,
            NotificationClient notificationClient) {

        this.orderRepository = orderRepository;

        this.inventoryClient = inventoryClient;

        this.productClient = productClient;

        this.paymentClient = paymentClient;

        this.notificationClient =
                notificationClient;
    }

    @Transactional
    public OrderResponse createOrder(
            Long userId,
            OrderRequest request) {

        List<ProductClient.ProductResponse> products =
                new ArrayList<>();

        // 1. Validate products and inventory

        for (OrderItemRequest itemRequest :
                request.getItems()) {

            ProductClient.ProductResponse product =
                    productClient.getProduct(
                            itemRequest.getProductId());

            if (product == null) {

                throw new IllegalStateException(
                        "Product not found: "
                                + itemRequest.getProductId());
            }

            if (!Boolean.TRUE.equals(
                    product.getActive())) {

                throw new IllegalStateException(
                        "Product is not active: "
                                + itemRequest.getProductId());
            }

            InventoryClient.InventoryResponse inventory =
                    inventoryClient.getInventory(
                            itemRequest.getProductId());

            if (inventory == null) {

                throw new IllegalStateException(
                        "Inventory not found for product: "
                                + itemRequest.getProductId());
            }

            if (inventory.getAvailableQuantity()
                    < itemRequest.getQuantity()) {

                throw new IllegalStateException(
                        "Insufficient stock for product: "
                                + itemRequest.getProductId());
            }

            products.add(product);
        }

        // 2. Reserve inventory

        for (OrderItemRequest itemRequest :
                request.getItems()) {

            inventoryClient.reserveStock(
                    itemRequest.getProductId(),
                    itemRequest.getQuantity());
        }

        // 3. Create order

        Order order = new Order();

        order.setOrderNumber(
                generateOrderNumber());

        order.setUserId(userId);

        order.setStatus(
                OrderStatus.CREATED);

        order.setCreatedAt(
                LocalDateTime.now());

        order.setUpdatedAt(
                LocalDateTime.now());

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        // 4. Create order items

        for (int i = 0;
             i < request.getItems().size();
             i++) {

            OrderItemRequest itemRequest =
                    request.getItems().get(i);

            ProductClient.ProductResponse product =
                    products.get(i);

            BigDecimal price =
                    product.getPrice();

            BigDecimal subtotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    itemRequest.getQuantity()));

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setProductId(
                    itemRequest.getProductId());

            orderItem.setQuantity(
                    itemRequest.getQuantity());

            orderItem.setPrice(price);

            orderItem.setSubtotal(subtotal);

            order.addOrderItem(orderItem);

            totalAmount =
                    totalAmount.add(subtotal);
        }

        order.setTotalAmount(
                totalAmount);

        // 5. Save order

        Order savedOrder =
                orderRepository.save(order);

        // 6. Process payment

        PaymentClient.PaymentResponse paymentResponse =
                paymentClient.createPayment(
                        savedOrder.getId(),
                        userId,
                        totalAmount,
                        "CREDIT_CARD");

        if (paymentResponse == null
                || !"SUCCESS".equals(
                        paymentResponse.getStatus())) {

            /*
             * Payment failed.
             *
             * Release the inventory that
             * was already reserved.
             */

            for (OrderItem orderItem :
                    savedOrder.getOrderItems()) {

                inventoryClient.releaseStock(
                        orderItem.getProductId(),
                        orderItem.getQuantity());
            }

            savedOrder.setStatus(
                    OrderStatus.CANCELLED);

            savedOrder.setUpdatedAt(
                    LocalDateTime.now());

            Order cancelledOrder =
                    orderRepository.save(
                            savedOrder);

            notificationClient.createNotification(
                    userId,
                    cancelledOrder.getId(),
                    "PAYMENT_FAILED",
                    "Payment failed for order: "
                            + cancelledOrder
                                    .getOrderNumber());

            return mapToResponse(
                    cancelledOrder);
        }

        // 7. Payment succeeded.
        //
        // Finalize the reserved inventory.
        //
        // Example:
        //
        // stock = 20
        // reserved = 2
        //
        // after finalize:
        //
        // stock = 18
        // reserved = 0

        for (OrderItem orderItem :
                savedOrder.getOrderItems()) {

            inventoryClient.finalizeStock(
                    orderItem.getProductId(),
                    orderItem.getQuantity());
        }

        // 8. Confirm order

        savedOrder.setStatus(
                OrderStatus.CONFIRMED);

        savedOrder.setUpdatedAt(
                LocalDateTime.now());

        Order confirmedOrder =
                orderRepository.save(
                        savedOrder);

        // 9. Create confirmation notification

        String notificationMessage =
                "Your order "
                        + confirmedOrder
                                .getOrderNumber()
                        + " has been confirmed successfully.";

        notificationClient.createNotification(
                userId,
                confirmedOrder.getId(),
                "ORDER_CONFIRMED",
                notificationMessage);

        return mapToResponse(
                confirmedOrder);
    }

    public List<OrderResponse> getOrdersByUser(
            Long userId) {

        return orderRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrderById(
            Long userId,
            Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with id: "
                                                + orderId));

        validateOrderOwnership(
                order,
                userId);

        return mapToResponse(order);
    }

    public OrderResponse getOrderByNumber(
            Long userId,
            String orderNumber) {

        Order order =
                orderRepository
                        .findByOrderNumber(
                                orderNumber)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with order number: "
                                                + orderNumber));

        validateOrderOwnership(
                order,
                userId);

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(
            Long userId,
            Long orderId) {

        // 1. Find order

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with id: "
                                                + orderId));

        // 2. Verify ownership

        validateOrderOwnership(
                order,
                userId);

        // 3. Validate current status

        if (order.getStatus()
                        != OrderStatus.CREATED
                && order.getStatus()
                        != OrderStatus.CONFIRMED) {

            throw new IllegalStateException(
                    "Order cannot be cancelled in status: "
                            + order.getStatus());
        }

        // 4. Release inventory

        for (OrderItem orderItem :
                order.getOrderItems()) {

            inventoryClient.releaseStock(
                    orderItem.getProductId(),
                    orderItem.getQuantity());
        }

        // 5. Find payment for this order

        PaymentClient.PaymentResponse payment =
                paymentClient.getPaymentByOrderId(
                        orderId);

        // 6. Refund payment if successful

        if (payment != null
                && "SUCCESS".equals(
                        payment.getStatus())) {

            paymentClient.refundPayment(
                    payment.getId());
        }

        // 7. Change order status

        order.setStatus(
                OrderStatus.CANCELLED);

        order.setUpdatedAt(
                LocalDateTime.now());

        Order cancelledOrder =
                orderRepository.save(order);

        // 8. Create cancellation notification

        String notificationMessage =
                "Your order "
                        + cancelledOrder
                                .getOrderNumber()
                        + " has been cancelled successfully.";

        notificationClient.createNotification(
                userId,
                cancelledOrder.getId(),
                "ORDER_CANCELLED",
                notificationMessage);

        return mapToResponse(
                cancelledOrder);
    }

    private void validateOrderOwnership(
            Order order,
            Long userId) {

        if (order.getUserId() == null
                || !order.getUserId()
                        .equals(userId)) {

            throw new OrderNotFoundException(
                    "Order not found with id: "
                            + order.getId());
        }
    }

    private String generateOrderNumber() {

        return "ORD-"
                + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private OrderResponse mapToResponse(
            Order order) {

        OrderResponse response =
                new OrderResponse();

        response.setId(
                order.getId());

        response.setOrderNumber(
                order.getOrderNumber());

        response.setUserId(
                order.getUserId());

        response.setTotalAmount(
                order.getTotalAmount());

        response.setStatus(
                order.getStatus());

        response.setCreatedAt(
                order.getCreatedAt());

        response.setUpdatedAt(
                order.getUpdatedAt());

        List<OrderItemResponse> itemResponses =
                order.getOrderItems()
                        .stream()
                        .map(this::mapItemToResponse)
                        .toList();

        response.setItems(
                itemResponses);

        return response;
    }

    private OrderItemResponse mapItemToResponse(
            OrderItem item) {

        OrderItemResponse response =
                new OrderItemResponse();

        response.setId(
                item.getId());

        response.setProductId(
                item.getProductId());

        response.setQuantity(
                item.getQuantity());

        response.setPrice(
                item.getPrice());

        response.setSubtotal(
                item.getSubtotal());

        return response;
    }
}