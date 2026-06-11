import { Product, type ProductDTO } from "../models/Product";

/** Mirrors a Spring Data JPA Repository interface */
const PRODUCT_DATA: ProductDTO[] = [
  // Smartphones - Premium Selection
  { id: 2, name: "iPhone 15 Pro Max 256GB - Titanium Blue", price: 134900, originalPrice: 159900, discount: 16, rating: 4.9, reviews: 12847, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop&q=95", category: "Smartphones", inStock: true, seller: "Apple Authorized", badge: "Flagship" },
  { id: 3, name: "Samsung Galaxy S24 Ultra 5G (512GB)", price: 124999, originalPrice: 149999, discount: 17, rating: 4.8, reviews: 8521, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=95", category: "Smartphones", inStock: true, seller: "Samsung Official", badge: "Best Seller" },
  { id: 4, name: "OnePlus 12 5G (256GB, Flowy Emerald)", price: 64999, originalPrice: 79999, discount: 19, rating: 4.7, reviews: 5218, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop&q=95", category: "Smartphones", inStock: true, seller: "OnePlus Store", badge: "Hot Deal" },

  // Laptops - Premium Selection
  { id: 5, name: 'MacBook Pro 14" M3 Pro 18GB RAM 1TB SSD', price: 219900, originalPrice: 249900, discount: 12, rating: 4.9, reviews: 4567, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop&q=95", category: "Laptops", inStock: true, seller: "Apple Authorized", badge: "Pro Choice" },
  { id: 6, name: "Dell XPS 15 OLED Intel i9 32GB 1TB", price: 159999, originalPrice: 199999, discount: 20, rating: 4.8, reviews: 2876, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=95", category: "Laptops", inStock: true, seller: "Dell Official", badge: "Creator's Pick" },
  { id: 7, name: "ASUS ROG Zephyrus G16 Gaming Beast", price: 169990, originalPrice: 219990, discount: 23, rating: 4.8, reviews: 3187, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop&q=95", category: "Laptops", inStock: true, seller: "ASUS Gaming", badge: "Gaming King" },

  // TVs - Premium Selection
  { id: 8, name: 'LG 65" OLED C3 4K Evo Smart TV', price: 149990, originalPrice: 199990, discount: 25, rating: 4.9, reviews: 2187, image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop&q=95", category: "TVs", inStock: true, seller: "LG Electronics", badge: "Premium OLED" },
  { id: 9, name: 'Samsung 75" Neo QLED 8K Smart TV', price: 199990, originalPrice: 279990, discount: 29, rating: 4.8, reviews: 1543, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&q=95", category: "TVs", inStock: true, seller: "Samsung Official", badge: "8K Ready" },

  // Audio - Premium Selection
  { id: 10, name: "Sony WH-1000XM5 Noise Cancelling", price: 26990, originalPrice: 34990, discount: 23, rating: 4.9, reviews: 15678, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=95", category: "Headphones", inStock: true, seller: "Sony Official", badge: "#1 Rated" },
  { id: 11, name: "AirPods Pro 2nd Gen (USB-C)", price: 23900, originalPrice: 26900, discount: 11, rating: 4.8, reviews: 18912, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop&q=95", category: "Headphones", inStock: true, seller: "Apple Authorized", badge: "Trending" },

  // Cameras - Premium Selection
  { id: 12, name: "Sony Alpha A7 IV Mirrorless (Body Only)", price: 199990, originalPrice: 239990, discount: 17, rating: 4.9, reviews: 2234, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&q=95", category: "Cameras", inStock: true, seller: "Sony India", badge: "Pro's Choice" },
  { id: 13, name: "Canon EOS R6 Mark II Mirrorless + RF 24-105mm", price: 249990, originalPrice: 299990, discount: 17, rating: 4.8, reviews: 1834, image: "https://images.unsplash.com/photo-1606980707315-1beb5fea0d44?w=800&h=800&fit=crop&q=95", category: "Cameras", inStock: true, seller: "Canon India", badge: "Full Frame" },

  // Gaming - Premium Selection
  { id: 14, name: "PlayStation 5 Slim Disc Edition 1TB", price: 54990, originalPrice: 64990, discount: 15, rating: 4.9, reviews: 9521, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop&q=95", category: "Gaming", inStock: true, seller: "Sony India", badge: "Next Gen" },
  { id: 15, name: "Xbox Series X 1TB Console Bundle", price: 52990, originalPrice: 64990, discount: 18, rating: 4.8, reviews: 6217, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop&q=95", category: "Gaming", inStock: true, seller: "Microsoft Store", badge: "Power Play" },

  // Wearables
  { id: 16, name: "Apple Watch Ultra 2 Titanium 49mm GPS + Cellular", price: 89900, originalPrice: 99900, discount: 10, rating: 4.9, reviews: 5234, image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=800&fit=crop&q=95", category: "Smart Watches", inStock: true, seller: "Apple Authorized", badge: "Ultra" },
  { id: 17, name: "Samsung Galaxy Watch 6 Classic (LTE)", price: 36999, originalPrice: 46999, discount: 21, rating: 4.7, reviews: 4891, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop&q=95", category: "Smart Watches", inStock: true, seller: "Samsung Official", badge: "Premium" },

  // Men's Fashion - Premium Selection
  { id: 18, name: "Levi's 511 Premium Slim Fit Jeans (Indigo)", price: 2999, originalPrice: 4999, discount: 40, rating: 4.7, reviews: 12712, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop&q=95", category: "Men's Fashion", inStock: true, seller: "Levi's India", badge: "Iconic" },
  { id: 19, name: "Raymond Premium Wool Blazer (Charcoal)", price: 7999, originalPrice: 14999, discount: 47, rating: 4.6, reviews: 2243, image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=800&fit=crop&q=95", category: "Men's Fashion", inStock: true, seller: "Raymond Store", badge: "Luxury" },

  // Women's Fashion - Premium Selection  
  { id: 20, name: "Libas Designer Embroidered Kurta Set (Royal Blue)", price: 2499, originalPrice: 4999, discount: 50, rating: 4.8, reviews: 8234, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&q=95", category: "Women's Fashion", inStock: true, seller: "Libas Fashion", badge: "Designer" },
  { id: 21, name: "Only Premium Skinny High-Rise Jeans", price: 1999, originalPrice: 3499, discount: 43, rating: 4.6, reviews: 6521, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop&q=95", category: "Women's Fashion", inStock: true, seller: "Only Brand India", badge: "Bestseller" },

  // Footwear - Premium Selection
  { id: 22, name: "Nike Air Jordan 1 Mid (Black/White)", price: 11995, originalPrice: 14995, discount: 20, rating: 4.9, reviews: 15234, image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&h=800&fit=crop&q=95", category: "Footwear", inStock: true, seller: "Nike India", badge: "Iconic" },
  { id: 23, name: "Adidas Ultraboost 23 (Women's)", price: 14999, originalPrice: 17999, discount: 17, rating: 4.8, reviews: 8671, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop&q=95", category: "Footwear", inStock: true, seller: "Adidas Official", badge: "Performance" },

  // Accessories - Premium Selection
  { id: 24, name: "Fossil Gen 6 Hybrid Smartwatch (Brown Leather)", price: 14995, originalPrice: 21995, discount: 32, rating: 4.7, reviews: 3341, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop&q=95", category: "Accessories", inStock: true, seller: "Fossil Official", badge: "Hybrid Tech" },

  // Bags - Premium Selection
  { id: 25, name: "American Tourister Valex 55cm Cabin Luggage", price: 4299, originalPrice: 7999, discount: 46, rating: 4.8, reviews: 11712, image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&h=800&fit=crop&q=95", category: "Bags", inStock: true, seller: "American Tourister", badge: "Travel Essential" },
];

export class ProductRepository {
  private static products: Product[] = PRODUCT_DATA.map((d) => new Product(d));

  static findAll(): Product[] {
    return [...this.products];
  }

  static findById(id: number): Product | null {
    return this.products.find((p) => p.getId() === id) ?? null;
  }

  static findByCategory(category: string): Product[] {
    return this.products.filter((p) => p.getCategory() === category);
  }

  static findByNameContaining(query: string): Product[] {
    const lower = query.toLowerCase();
    return this.products.filter((p) => p.getName().toLowerCase().includes(lower));
  }

  static findByCategoryAndNameContaining(category: string, query: string): Product[] {
    return this.products.filter((p) => {
      const matchesCategory = category === "All" || p.getCategory() === category;
      const matchesSearch = p.getName().toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  static findAllCategories(): string[] {
    const cats = new Set(this.products.map((p) => p.getCategory()));
    return ["All", ...Array.from(cats)];
  }
}