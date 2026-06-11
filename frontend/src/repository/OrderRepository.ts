import { Order, OrderItem, OrderStatus, PaymentMethod, type OrderDTO, type PlaceOrderRequest } from "../models/Order";
import { ProductRepository } from "./ProductRepository";

/** In-memory store seeded with mock history — mirrors Spring Data JPA OrderRepository */
function buildSeedOrders(): Order[] {
  const p = (id: number) => ProductRepository.findById(id)!.toDTO();

  const seed: PlaceOrderRequest[] = [
    {
      userId: "SEED_USER",
      items: [
        { product: p(12), quantity: 1 },
        { product: p(14), quantity: 2 },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      deliveryAddress: { fullName: "Rahul Sharma", phone: "9876543210", addressLine: "123 MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001" },
    },
    {
      userId: "SEED_USER",
      items: [{ product: p(7), quantity: 1 }],
      paymentMethod: PaymentMethod.COD,
      deliveryAddress: { fullName: "Rahul Sharma", phone: "9876543210", addressLine: "456 Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040" },
    },
    {
      userId: "SEED_USER",
      items: [{ product: p(19), quantity: 1 }],
      paymentMethod: PaymentMethod.ONLINE,
      deliveryAddress: { fullName: "Rahul Sharma", phone: "9876543210", addressLine: "789 Connaught Place", city: "New Delhi", state: "Delhi", pincode: "110001" },
    },
    {
      userId: "SEED_USER",
      items: [
        { product: p(1), quantity: 1 },
        { product: p(17), quantity: 1 },
      ],
      paymentMethod: PaymentMethod.ONLINE,
      deliveryAddress: { fullName: "Rahul Sharma", phone: "9876543210", addressLine: "321 FC Road", city: "Pune", state: "Maharashtra", pincode: "411005" },
    },
  ];

  const statuses = [OrderStatus.DELIVERED, OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING];
  const daysAgo = [11, 28, 6, 2];

  return seed.map((req, i) => {
    const items = req.items.map((it) => new OrderItem(it.product, it.quantity));
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo[i]);
    const order = new Order({ ...req, items, createdAt });
    order.setStatus(statuses[i]);
    return order;
  });
}

export class OrderRepository {
  private static orders: Order[] = buildSeedOrders();

  static save(order: Order): Order {
    const idx = this.orders.findIndex((o) => o.getId() === order.getId());
    if (idx >= 0) {
      this.orders[idx] = order;
    } else {
      this.orders.unshift(order);
    }
    return order;
  }

  static findByUserId(userId: string): Order[] {
    return this.orders
      .filter((o) => o.getUserId() === userId || o.getUserId() === "SEED_USER")
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
  }

  static findById(id: string): Order | null {
    return this.orders.find((o) => o.getId() === id) ?? null;
  }

  static updateStatus(id: string, status: OrderStatus): Order | null {
    const order = this.findById(id);
    if (!order) return null;
    order.setStatus(status);
    return order;
  }

  static count(): number {
    return this.orders.length;
  }
}
