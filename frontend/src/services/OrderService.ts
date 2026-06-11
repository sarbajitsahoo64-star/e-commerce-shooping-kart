import { HttpClient, type ApiResponse } from "../api/ApiClient";
import { Order, OrderItem } from "../models/Order";
import type { OrderDTO, PlaceOrderRequest } from "../models/Order";
import { OrderRepository } from "../repository/OrderRepository";

/** @Service — mirrors Spring Boot @Service OrderService */
export class OrderService {
  static async placeOrder(request: PlaceOrderRequest): Promise<ApiResponse<OrderDTO>> {
    await HttpClient.delay(400, 800);

    if (!request.items || request.items.length === 0) {
      HttpClient.badRequest("Order must contain at least one item");
    }
    if (!request.deliveryAddress.addressLine || !request.deliveryAddress.pincode) {
      HttpClient.badRequest("Delivery address is incomplete");
    }

    const orderItems = request.items.map(
      (item) => new OrderItem(item.product, item.quantity)
    );
    const order = new Order({
      userId: request.userId,
      items: orderItems,
      paymentMethod: request.paymentMethod,
      deliveryAddress: request.deliveryAddress,
    });

    OrderRepository.save(order);
    return HttpClient.created(order.toDTO());
  }

  static async getOrdersByUser(userId: string): Promise<ApiResponse<OrderDTO[]>> {
    await HttpClient.delay(200, 400);
    const orders = OrderRepository.findByUserId(userId);
    return HttpClient.ok(orders.map((o) => o.toDTO()));
  }

  static async getOrderById(orderId: string): Promise<ApiResponse<OrderDTO>> {
    await HttpClient.delay(100, 200);
    const order = OrderRepository.findById(orderId);
    if (!order) HttpClient.notFound(`Order #${orderId}`);
    return HttpClient.ok(order!.toDTO());
  }
}
