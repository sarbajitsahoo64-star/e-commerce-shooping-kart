import type { ProductDTO } from "./Product";

/** Java-style Entity — mirrors a Spring Boot @Entity Order class */
export class OrderItem {
  private product: ProductDTO;
  private quantity: number;

  constructor(product: ProductDTO, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }

  getProduct(): ProductDTO { return this.product; }
  getQuantity(): number { return this.quantity; }
  getLineTotal(): number { return this.product.price * this.quantity; }

  toDTO(): OrderItemDTO {
    return { product: this.product, quantity: this.quantity };
  }
}

export class Order {
  private id: string;
  private userId: string;
  private items: OrderItem[];
  private status: OrderStatus;
  private paymentMethod: PaymentMethod;
  private deliveryAddress: DeliveryAddress;
  private createdAt: Date;
  private updatedAt: Date;
  private total: number;

  constructor(data: {
    userId: string;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    deliveryAddress: DeliveryAddress;
    id?: string;
    status?: OrderStatus;
    createdAt?: Date;
  }) {
    this.id = data.id ?? `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.userId = data.userId;
    this.items = data.items;
    this.paymentMethod = data.paymentMethod;
    this.deliveryAddress = data.deliveryAddress;
    this.status = data.status ?? OrderStatus.PROCESSING;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = new Date();
    this.total = this.calculateTotal();
  }

  private calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.getLineTotal(), 0);
    const delivery = subtotal > 500 ? 0 : 40;
    return subtotal + delivery;
  }

  getId(): string { return this.id; }
  getUserId(): string { return this.userId; }
  getItems(): OrderItem[] { return this.items; }
  getStatus(): OrderStatus { return this.status; }
  getPaymentMethod(): PaymentMethod { return this.paymentMethod; }
  getDeliveryAddress(): DeliveryAddress { return this.deliveryAddress; }
  getCreatedAt(): Date { return this.createdAt; }
  getTotal(): number { return this.total; }

  setStatus(status: OrderStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  toDTO(): OrderDTO {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items.map((i) => i.toDTO()),
      status: this.status,
      paymentMethod: this.paymentMethod,
      deliveryAddress: this.deliveryAddress,
      createdAt: this.createdAt.toISOString(),
      total: this.total,
    };
  }
}

export enum OrderStatus {
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export enum PaymentMethod {
  COD = "Cash on Delivery",
  ONLINE = "Online Payment",
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemDTO {
  product: ProductDTO;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  items: OrderItemDTO[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  total: number;
}

export interface PlaceOrderRequest {
  userId: string;
  items: OrderItemDTO[];
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
}
