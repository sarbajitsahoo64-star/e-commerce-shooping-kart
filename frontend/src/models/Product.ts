/** Java-style Entity — mirrors a Spring Boot @Entity class */
export class Product {
  private id: number;
  private name: string;
  private price: number;
  private originalPrice: number;
  private discount: number;
  private rating: number;
  private reviews: number;
  private image: string;
  private category: string;
  private inStock: boolean;
  private seller: string;
  private badge?: string;

  constructor(data: {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    inStock: boolean;
    seller: string;
    badge?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.originalPrice = data.originalPrice;
    this.discount = data.discount;
    this.rating = data.rating;
    this.reviews = data.reviews;
    this.image = data.image;
    this.category = data.category;
    this.inStock = data.inStock;
    this.seller = data.seller;
    this.badge = data.badge;
  }

  getId(): number { return this.id; }
  getName(): string { return this.name; }
  getPrice(): number { return this.price; }
  getOriginalPrice(): number { return this.originalPrice; }
  getDiscount(): number { return this.discount; }
  getRating(): number { return this.rating; }
  getReviews(): number { return this.reviews; }
  getImage(): string { return this.image; }
  getCategory(): string { return this.category; }
  isInStock(): boolean { return this.inStock; }
  getSeller(): string { return this.seller; }
  getBadge(): string | undefined { return this.badge; }

  getSavings(): number {
    return this.originalPrice - this.price;
  }

  toDTO(): ProductDTO {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      originalPrice: this.originalPrice,
      discount: this.discount,
      rating: this.rating,
      reviews: this.reviews,
      image: this.image,
      category: this.category,
      inStock: this.inStock,
      seller: this.seller,
      badge: this.badge,
    };
  }
}

export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  seller: string;
  badge?: string;
}
