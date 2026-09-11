package com.example.orbit_order_service.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.orbit_order_service.client.InventoryClient;
import com.example.orbit_order_service.client.NotificationClient;
import com.example.orbit_order_service.client.PaymentClient;
import com.example.orbit_order_service.client.ProductClient;
import com.example.orbit_order_service.dto.AdminOrderStatusRequest;
import com.example.orbit_order_service.dto.OrderItemRequest;
import com.example.orbit_order_service.dto.OrderItemResponse;
import com.example.orbit_order_service.dto.OrderRequest;
import com.example.orbit_order_service.dto.OrderResponse;
import com.example.orbit_order_service.exception.OrderNotFoundException;
import com.example.orbit_order_service.model.Order;
import com.example.orbit_order_service.model.OrderItem;
import com.example.orbit_order_service.model.OrderStatus;
import com.example.orbit_order_service.repository.OrderRepository;

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
             * Inventory was already reserved,
             * so release the reservation.
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

    // ============================================================
    // CUSTOMER OPERATIONS
    // ============================================================

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

        /*
         * 4. Handle inventory differently
         *    based on the order status.
         *
         * CREATED:
         * Inventory is still reserved.
         * Therefore release the reservation.
         *
         * CONFIRMED:
         * Payment succeeded and inventory
         * was already finalized.
         * Therefore we must RESTOCK the product.
         */

        if (order.getStatus()
                == OrderStatus.CREATED) {

            for (OrderItem orderItem :
                    order.getOrderItems()) {

                inventoryClient.releaseStock(
                        orderItem.getProductId(),
                        orderItem.getQuantity());
            }
        }

        /*
         * 5. Find payment for this order
         */

        PaymentClient.PaymentResponse payment =
                paymentClient.getPaymentByOrderId(
                        orderId);

        /*
         * 6. Refund successful payment
         */

        if (payment != null
                && "SUCCESS".equals(
                        payment.getStatus())) {

            paymentClient.refundPayment(
                    payment.getId());
        }

        /*
         * 7. If order was CONFIRMED,
         *    payment has been refunded and
         *    inventory must be added back.
         */

        if (order.getStatus()
                == OrderStatus.CONFIRMED) {

            for (OrderItem orderItem :
                    order.getOrderItems()) {

                inventoryClient.increaseStock(
                        orderItem.getProductId(),
                        orderItem.getQuantity());
            }
        }

        // 8. Change order status

        order.setStatus(
                OrderStatus.CANCELLED);

        order.setUpdatedAt(
                LocalDateTime.now());

        Order cancelledOrder =
                orderRepository.save(order);

        // 9. Create cancellation notification

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

    // ============================================================
    // ADMIN OPERATIONS
    // ============================================================

    /**
     * Returns all orders in the system.
     *
     * This method is intended for ADMIN users.
     */
    public List<OrderResponse> getAllOrders() {

        return orderRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Updates the status of an order.
     *
     * This method is intended for ADMIN users.
     *
     * Valid transitions:
     *
     * CREATED     -> CONFIRMED
     * CONFIRMED   -> PROCESSING
     * PROCESSING  -> SHIPPED
     * SHIPPED     -> DELIVERED
     */
    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            AdminOrderStatusRequest request) {

        // 1. Find order

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with id: "
                                                + orderId));

        // 2. Get current status

        OrderStatus currentStatus =
                order.getStatus();

        OrderStatus newStatus =
                request.getStatus();

        // 3. Do not allow changing to the same status

        if (currentStatus == newStatus) {

            throw new IllegalStateException(
                    "Order is already in status: "
                            + currentStatus);
        }

        // 4. CANCELLED is handled through
        //    the cancellation workflow.

        if (newStatus == OrderStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Use the cancellation workflow to cancel an order.");
        }

        // 5. Validate status transition

        validateStatusTransition(
                currentStatus,
                newStatus);

        // 6. Update status

        order.setStatus(
                newStatus);

        order.setUpdatedAt(
                LocalDateTime.now());

        Order updatedOrder =
                orderRepository.save(order);

        // 7. Create notification

        String notificationMessage =
                "Your order "
                        + updatedOrder
                                .getOrderNumber()
                        + " status has been updated to "
                        + newStatus
                        + ".";

        notificationClient.createNotification(
                updatedOrder.getUserId(),
                updatedOrder.getId(),
                "ORDER_CONFIRMED",
                notificationMessage);

        return mapToResponse(
                updatedOrder);
    }

    /**
     * Validates the order status state machine.
     */
    private void validateStatusTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus) {

        boolean validTransition = false;

        switch (currentStatus) {

            case CREATED:

                validTransition =
                        newStatus == OrderStatus.CONFIRMED;

                break;

            case CONFIRMED:

                validTransition =
                        newStatus == OrderStatus.PROCESSING;

                break;

            case PROCESSING:

                validTransition =
                        newStatus == OrderStatus.SHIPPED;

                break;

            case SHIPPED:

                validTransition =
                        newStatus == OrderStatus.DELIVERED;

                break;

            case DELIVERED:

                validTransition = false;

                break;

            case CANCELLED:

                validTransition = false;

                break;

            default:

                validTransition = false;
        }

        if (!validTransition) {

            throw new IllegalStateException(
                    "Invalid order status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus);
        }
    }

    // ============================================================
    // COMMON METHODS
    // ============================================================

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