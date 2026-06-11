import { useState } from "react";
import { ProductRepository } from "../repository/ProductRepository";
import {
  ShoppingCart,
  Search,
  Heart,
  User,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  MapPin,
  ChevronRight,
  Package,
  CreditCard,
  Check,
  LogOut,
  Eye,
  EyeOff,
  Clock,
  Smartphone,
  Tv,
  Laptop,
  Headphones,
  Camera,
  Gamepad2,
  Tablet,
  Watch,
  Shirt,
  ShoppingBag,
  Footprints,
  Gem,
} from "lucide-react";

// Types
interface Product {
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

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  id: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  items: CartItem[];
  total: number;
  paymentMethod: string;
  address: string;
}

// All products sourced from the repository (Java-style service layer)
const allProducts = ProductRepository.findAll().map((p) => p.toDTO());

// Seeded order history uses repository lookups by ID
function p(id: number): Product {
  const found = ProductRepository.findById(id);
  if (!found) throw new Error(`Seed product ${id} not found`);
  return found.toDTO() as unknown as Product;
}

const mockOrderHistory: OrderItem[] = [
  {
    id: "ORD-2024-78321",
    date: "2024-12-15",
    status: "Delivered",
    items: [
      { ...p(9), quantity: 1 },
      { ...p(10), quantity: 1 },
    ],
    total: 50890,
    paymentMethod: "Online Payment",
    address: "123 MG Road, Bangalore, Karnataka - 560001",
  },
  {
    id: "ORD-2024-65412",
    date: "2024-11-28",
    status: "Delivered",
    items: [
      { ...p(2), quantity: 1 },
      { ...p(17), quantity: 2 },
    ],
    total: 130997,
    paymentMethod: "Cash on Delivery",
    address: "456 Anna Nagar, Chennai, Tamil Nadu - 600040",
  },
  {
    id: "ORD-2024-54213",
    date: "2024-12-20",
    status: "Shipped",
    items: [
      { ...p(15), quantity: 1 },
      { ...p(21), quantity: 1 },
    ],
    total: 101895,
    paymentMethod: "Online Payment",
    address: "789 Connaught Place, New Delhi - 110001",
  },
  {
    id: "ORD-2024-43100",
    date: "2024-12-22",
    status: "Processing",
    items: [
      { ...p(2), quantity: 1 },
      { ...p(19), quantity: 1 },
      { ...p(24), quantity: 1 },
    ],
    total: 141799,
    paymentMethod: "Online Payment",
    address: "321 FC Road, Pune, Maharashtra - 411005",
  },
];

const categories = [
  "All",
  "Smartphones",
  "Laptops",
  "TVs",
  "Headphones",
  "Cameras",
  "Gaming",
  "Smart Watches",
  "Men's Fashion",
  "Women's Fashion",
  "Footwear",
  "Accessories",
  "Bags",
];

const categoryIcons: Record<string, React.ReactNode> = {
  Smartphones: <Smartphone className="w-4 h-4" />,
  Laptops: <Laptop className="w-4 h-4" />,
  TVs: <Tv className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Cameras: <Camera className="w-4 h-4" />,
  Gaming: <Gamepad2 className="w-4 h-4" />,
  "Smart Watches": <Watch className="w-4 h-4" />,
  "Men's Fashion": <Shirt className="w-4 h-4" />,
  "Women's Fashion": <Shirt className="w-4 h-4" />,
  Footwear: <Footprints className="w-4 h-4" />,
  Accessories: <Gem className="w-4 h-4" />,
  Bags: <ShoppingBag className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

type ActiveView = "shop" | "orders";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("shop");
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>(mockOrderHistory);

  // Auth state
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormData>({
    fullName: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    phone: loggedInUser?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) removeFromCart(id);
    else setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id: number) => setCart(cart.filter((item) => item.id !== id));

  const toggleWishlist = (id: number) => {
    setWishlist(wishlist.includes(id) ? wishlist.filter((w) => w !== id) : [...wishlist, id]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!loggedInUser) {
      setShowCart(false);
      setShowLogin(true);
      return;
    }
    setShowCart(false);
    setCheckoutForm((f) => ({
      ...f,
      fullName: loggedInUser.name,
      email: loggedInUser.email,
      phone: loggedInUser.phone,
    }));
    setShowCheckout(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: OrderItem = {
      id: `ORD-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      items: [...cart],
      total,
      paymentMethod: checkoutForm.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
      address: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.state} - ${checkoutForm.pincode}`,
    };
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderHistory([newOrder, ...orderHistory]);
      setCart([]);
      setShowCheckout(false);
      setOrderPlaced(false);
    }, 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setAuthError("Please fill all fields");
      return;
    }
    if (loginForm.password.length < 6) {
      setAuthError("Invalid credentials");
      return;
    }
    setLoggedInUser({
      name: loginForm.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: loginForm.email,
      phone: "",
    });
    setShowLogin(false);
    setAuthError("");
    setLoginForm({ email: "", password: "" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setAuthError("Please fill all required fields");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    if (signupForm.password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    setLoggedInUser({
      name: signupForm.name,
      email: signupForm.email,
      phone: signupForm.phone,
    });
    setShowLogin(false);
    setAuthError("");
    setSignupForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveView("shop");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl text-foreground border-b border-border/40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <Menu className="w-6 h-6" />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setActiveView("shop")}
              >
                <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:scale-105 transition-transform">
                  <Package className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ShopKart</h1>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search for electronics, mobiles, laptops..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-muted/50 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {loggedInUser ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setActiveView("orders")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                      activeView === "orders" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:bg-muted"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="hidden lg:inline">Orders</span>
                  </button>
                  <div className="relative group">
                    <button className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-full transition-all font-medium">
                      <User className="w-5 h-5 text-primary" />
                      <span className="hidden lg:inline text-sm max-w-24 truncate">
                        {loggedInUser.name.split(" ")[0]}
                      </span>
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-card text-foreground rounded-lg shadow-xl border border-border w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-sm">{loggedInUser.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{loggedInUser.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-muted transition text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setAuthTab("login"); setAuthError(""); }}
                  className="hidden sm:flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-full transition-all font-medium"
                >
                  <User className="w-5 h-5 text-primary" />
                  <span className="hidden lg:inline text-sm">Login</span>
                </button>
              )}

              <button className="relative hover:bg-muted p-2.5 rounded-full transition-all">
                <Heart className="w-6 h-6 text-foreground" />
                {wishlist.length > 0 && (
                  <span className="absolute 0 right-0 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm shadow-secondary/40 ring-2 ring-background">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-full shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm shadow-secondary/40 ring-2 ring-background">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden pb-4 px-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-muted/50 border border-transparent focus:outline-none focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-card shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
              {loggedInUser ? (
                <div>
                  <p className="font-semibold">{loggedInUser.name}</p>
                  <p className="text-xs opacity-80">{loggedInUser.email}</p>
                </div>
              ) : (
                <button
                  onClick={() => { setShowMobileMenu(false); setShowLogin(true); }}
                  className="text-sm font-semibold"
                >
                  Login / Sign Up
                </button>
              )}
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Categories
              </p>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveView("shop");
                      setShowMobileMenu(false);
                    }}
                  >
                    {categoryIcons[category] || <Package className="w-4 h-4" />}
                    {category}
                  </button>
                ))}
              </div>
              {loggedInUser && (
                <>
                  <div className="border-t border-border my-4" />
                  <button
                    onClick={() => { setActiveView("orders"); setShowMobileMenu(false); }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted"
                  >
                    <Clock className="w-4 h-4" />
                    Order History
                  </button>
                  <button
                    onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="bg-background/90 backdrop-blur-md border-b border-border/40 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide pb-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-semibold text-sm border ${
                  selectedCategory === category && activeView === "shop"
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105"
                    : "bg-card border-border text-foreground hover:bg-muted hover:border-primary/30"
                }`}
                onClick={() => { setSelectedCategory(category); setActiveView("shop"); }}
              >
                {categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === "orders" ? (
        /* Order History View */
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">My Orders</h2>
          </div>

          {orderHistory.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => setActiveView("shop")}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div key={order.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between px-5 py-4 bg-muted/40 border-b border-border gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">ORDER ID</p>
                        <p className="font-mono font-semibold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">DATE</p>
                        <p className="font-semibold">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">PAYMENT</p>
                        <p className="font-semibold">{order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-lg">₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className="font-bold text-sm whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* Shop View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              {selectedCategory !== "All" && (
                <> in <span className="font-semibold text-primary">{selectedCategory}</span></>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-muted/30 p-6 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm mix-blend-multiply dark:mix-blend-normal"
                  />
                  <button
                    className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-md rounded-full hover:bg-background shadow-sm transition-all hover:scale-110"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground"
                      }`}
                    />
                  </button>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {product.badge}
                    </div>
                  )}
                  {!product.badge && product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{product.seller}</p>
                  <h3 className="font-bold text-base line-clamp-2 mb-3 leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-md text-xs shadow-sm">
                      <span className="font-bold">{product.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">({product.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-5 mt-auto">
                    <span className="text-xl font-black tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
                    <span className="text-sm font-medium text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground py-2.5 rounded-xl transition-all font-bold text-sm active:scale-95 flex items-center justify-center gap-2"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      )}

      {/* Login/Signup Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogin(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground px-6 py-8">
              <button
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
                onClick={() => setShowLogin(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <Package className="w-10 h-10 mb-3" />
              <h2 className="text-2xl font-bold">
                {authTab === "login" ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-sm opacity-80 mt-1">
                {authTab === "login"
                  ? "Login to access your orders, wishlist & more"
                  : "Join ShopKart for exclusive deals & fast delivery"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  authTab === "login"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => { setAuthTab("login"); setAuthError(""); }}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  authTab === "signup"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => { setAuthTab("signup"); setAuthError(""); }}
              >
                Sign Up
              </button>
            </div>

            <div className="p-6">
              {authError && (
                <div className="mb-4 bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg border border-destructive/20">
                  {authError}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-2.5 pr-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    Login to ShopKart
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    New here?{" "}
                    <button
                      type="button"
                      className="text-primary font-semibold hover:underline"
                      onClick={() => setAuthTab("signup")}
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Min. 6 chars"
                          className="w-full px-4 py-2.5 pr-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Confirm *</label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat"
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    Create Account
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-semibold hover:underline"
                      onClick={() => setAuthTab("login")}
                    >
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-card shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold">Shopping Cart ({cart.length})</h2>
              <button onClick={() => setShowCart(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm">Add electronics to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-muted/50 p-3 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-18 w-[72px] h-[72px] object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs line-clamp-2 mb-1">{item.name}</h3>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="font-bold text-sm">₹{item.price.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{item.originalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              className="p-1 rounded bg-background border border-border hover:bg-muted"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
                            <button
                              className="p-1 rounded bg-background border border-border hover:bg-muted"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-border">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 rounded-lg font-bold transition"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                {!loggedInUser && (
                  <p className="text-xs text-center text-muted-foreground">
                    You will be asked to login before checkout
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !orderPlaced && setShowCheckout(false)}
            />
            <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {orderPlaced ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                  <p className="text-muted-foreground mb-4">
                    Thank you for shopping at ShopKart. Your order is confirmed!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order Total: <span className="font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold">Checkout</h2>
                    <button onClick={() => setShowCheckout(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Delivery Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm mb-1.5">Full Name *</label>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                value={checkoutForm.fullName}
                                onChange={(e) =>
                                  setCheckoutForm({ ...checkoutForm, fullName: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm mb-1.5">Email *</label>
                                <input
                                  type="email"
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                  value={checkoutForm.email}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, email: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1.5">Phone *</label>
                                <input
                                  type="tel"
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                  value={checkoutForm.phone}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm mb-1.5">Address *</label>
                              <textarea
                                required
                                rows={3}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                                value={checkoutForm.address}
                                onChange={(e) =>
                                  setCheckoutForm({ ...checkoutForm, address: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm mb-1.5">City *</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                  value={checkoutForm.city}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, city: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1.5">State *</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                  value={checkoutForm.state}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, state: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1.5">Pincode *</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                  value={checkoutForm.pincode}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Payment Method
                          </h3>
                          <div className="space-y-3">
                            {[
                              { value: "cod", label: "Cash on Delivery", sub: "Pay when you receive the order" },
                              { value: "online", label: "Online Payment", sub: "UPI, Cards, Net Banking" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                                  checkoutForm.paymentMethod === opt.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="payment"
                                  value={opt.value}
                                  checked={checkoutForm.paymentMethod === opt.value}
                                  onChange={(e) =>
                                    setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })
                                  }
                                  className="w-4 h-4"
                                />
                                <div>
                                  <div className="font-semibold">{opt.label}</div>
                                  <div className="text-sm text-muted-foreground">{opt.sub}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {cart.map((item) => (
                              <div key={item.id} className="flex gap-3 text-sm">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium line-clamp-2 text-xs">{item.name}</div>
                                  <div className="text-muted-foreground text-xs">Qty: {item.quantity}</div>
                                  <div className="font-semibold">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal</span>
                              <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Discount</span>
                              <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Delivery Fee</span>
                              <span className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                              <span>Total Amount</span>
                              <span>₹{total.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                          >
                            Place Order
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}