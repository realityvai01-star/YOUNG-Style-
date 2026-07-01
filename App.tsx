import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, X, Heart, ArrowLeftRight, Search, SlidersHorizontal, Eye, 
  MapPin, Clock, Truck, ShieldCheck, Check, Info, FileText
} from "lucide-react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRAcFEiFZkVkBzSSK2vqWZlMZ5xvtZPZg",
  authDomain: "young-style-b68d9.firebaseapp.com",
  projectId: "young-style-b68d9",
  storageBucket: "young-style-b68d9.firebasestorage.app",
  messagingSenderId: "342531476001",
  appId: "1:342531476001:web:8a37116a9c67a608367160",
  measurementId: "G-XJNK1LW3ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { Product, Order, Coupon, Blog, Message, WebsiteSettings, User } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSlider from "./components/HeroSlider";
import ProductCard from "./components/ProductCard";
import QuickViewModal from "./components/QuickViewModal";
import { 
  FeaturedCategories, DeliveryFeatures, CustomerReviewsSection, InstagramGallery, NewsletterSection 
} from "./components/HomeSections";
import ContactForm from "./components/ContactForm";
import CheckoutPage from "./components/CheckoutPage";
import ProductDetails from "./components/ProductDetails";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminPanel from "./components/AdminPanel";
import HelplineChat from "./components/HelplineChat";

export default function App() {
  // Navigation & Page views
  const [view, setView] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Core records
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  // Authentication Context
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Local persistence: Shopping cart and wishlist states
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Modals & Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  const [filterPrice, setFilterPrice] = useState<number>(3000); // Max Price threshold
  const [sortBy, setSortBy] = useState<string>("latest");

  // Track Order state
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Initial State Hydration & API sync
  const loadCoreData = async () => {
    try {
      // Products
      const pRes = await fetch("/api/products");
      const pData = await pRes.json();
      if (pRes.ok) setProducts(pData);

      // Blogs
      const bRes = await fetch("/api/blogs");
      const bData = await bRes.json();
      if (bRes.ok) setBlogs(bData);

      // Coupons
      const cRes = await fetch("/api/coupons");
      const cData = await cRes.json();
      if (cRes.ok) setCoupons(cData);

      // Settings
      const sRes = await fetch("/api/settings");
      const sData = await sRes.json();
      if (sRes.ok) setSettings(sData);

      // Messages (Admin only)
      const mRes = await fetch("/api/messages");
      const mData = await mRes.json();
      if (mRes.ok) setMessages(mData);

      // Orders (Admin only)
      const oRes = await fetch("/api/orders");
      const oData = await oRes.json();
      if (oRes.ok) setOrders(oData);
    } catch (err) {
      console.error("Failed to load global workspace datasets", err);
    }
  };

  useEffect(() => {
    // Hydrate Client states from Storage
    const savedToken = localStorage.getItem("ys_token");
    const savedUser = localStorage.getItem("ys_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    const savedCart = localStorage.getItem("ys_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWish = localStorage.getItem("ys_wishlist");
    if (savedWish) setWishlist(JSON.parse(savedWish));

    loadCoreData();
  }, []);

  // Update storage on cart modification
  useEffect(() => {
    localStorage.setItem("ys_cart", JSON.stringify(cart));
  }, [cart]);

  // Update storage on wishlist modification
  useEffect(() => {
    localStorage.setItem("ys_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Set Auth helper
  const handleSetAuth = (usr: User | null, tkn: string | null) => {
    if (usr && tkn) {
      setUser(usr);
      setToken(tkn);
      fetch('/api/auth/social', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: 'google', // অথবা 'facebook'
    name: 'ব্যবহারকারীর নাম',
    email: 'user@example.com',
    profilePicture: 'https://example.com/photo.jpg',
  }),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // এখানে সফল লগইনের পর পরবর্তী পদক্ষেপ নিন
})
.catch((error) => {
  console.error('Error:', error);
});
      localStorage.setItem("ys_token", tkn);
      localStorage.setItem("ys_user", JSON.stringify(usr));
      loadCoreData();
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem("ys_token");
      localStorage.removeItem("ys_user");
    }
  };

  const handleLogout = () => {
    handleSetAuth(null, null);
    setView("home");
  };

  // Cart Management
  const handleAddToCart = (product: Product, size: string = "M", color: string = "#000000") => {
    const existingIdx = cart.findIndex(
      (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.discountPrice,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
          image: product.images[0]
        }
      ]);
    }
    setCartOpen(true);
  };

  const handleUpdateCartQty = (idx: number, delta: number) => {
    const updated = [...cart];
    updated[idx].quantity += delta;
    if (updated[idx].quantity <= 0) {
      updated.splice(idx, 1);
    }
    setCart(updated);
  };

  const handleRemoveFromCart = (idx: number) => {
    const updated = [...cart];
    updated.splice(idx, 1);
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleBuyNow = (product: Product, size: string = "M", color: string = "#000000") => {
    handleAddToCart(product, size, color);
    setView("checkout");
  };

  // Wishlist Management
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Compare System
  const handleToggleCompare = (product: Product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 products at a time!");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  // Order Tracking Lookup
  const handleTrackLookup = async (idToTrack?: string) => {
    setTrackError("");
    setTrackedOrder(null);
    const orderId = idToTrack || trackOrderId;
    if (!orderId) return;

    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found in database.");
      }
      setTrackedOrder(data);
    } catch (err: any) {
      setTrackError(err.message || "An error occurred during lookup.");
    }
  };

  useEffect(() => {
    if (lastOrder) {
      setTrackedOrder(lastOrder);
      setTrackOrderId(lastOrder.id);
      setLastOrder(null);
    }
  }, [lastOrder]);

  // Filtering Logic for Shop View
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" ? true : prod.category === filterCategory;
    const matchesSize = filterSize === "all" ? true : prod.sizes.includes(filterSize);
    const matchesColor = filterColor === "all" ? true : prod.colors.includes(filterColor);
    const matchesPrice = prod.discountPrice <= filterPrice;

    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.discountPrice - b.discountPrice;
    if (sortBy === "price-high") return b.discountPrice - a.discountPrice;
    if (sortBy === "popular") return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // default latest
  });

  // Render components conditionally
  const renderedSettings = settings || {
    websiteName: "YOUNG Style",
    tagline: "Premium Shirt & T-Shirt Collection",
    primaryColor: "#1877F2",
    secondaryColor: "#000000",
    buttonColor: "#1877F2",
    backgroundColor: "#FFFFFF",
    themeMode: "light" as const,
    bannerImages: [
      {
        id: "banner-1",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&q=80",
        title: "LUXURY LINEN COLLECTION",
        subtitle: "Hand-finished tailored fits crafted in pure premium linen yarns.",
        link: "/shop?category=shirt"
      },
      {
        id: "banner-2",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&q=80",
        title: "HEAVYWEIGHT GRAPHICS",
        subtitle: "Oversized drop-shoulder streetwear cotton tees.",
        link: "/shop?category=t-shirt"
      }
    ],
    announcementBar: "🚚 FREE Inside Dhaka Shipping on Orders Over ৳2500! Safe Cash On Delivery Nationwide.",
    homeSections: {
      heroSlider: true, promotionBar: true, featuredCategories: true,
      featuredProducts: true, newArrivals: true, bestSellers: true,
      trending: true, flashSale: true, newsletter: true, reviews: true,
      instagramGallery: true, deliveryFeatures: true
    },
    socialLinks: {
      facebook: "https://facebook.com", instagram: "https://instagram.com",
      youtube: "https://youtube.com", tiktok: "https://tiktok.com",
      linkedin: "https://linkedin.com", whatsapp: "https://wa.me/8801700000000",
      messenger: "https://m.me/youngstyle"
    },
    deliveryPartners: []
  };

  const activeCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const themeBgColor = renderedSettings.customThemeMode === "dark" ? "#0B0F19" : 
                       renderedSettings.customThemeMode === "sepia" ? "#FAF3E0" : 
                       renderedSettings.customThemeMode === "cosmic" ? "#080710" : 
                       renderedSettings.customThemeMode === "facebook" ? "#F0F2F5" : 
                       "#FFFFFF";

  const themeTextColor = renderedSettings.textColor || "#1E293B";
  const themePrimaryColor = renderedSettings.primaryColor || "#1877F2";

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-blue-100 transition-colors duration-300"
      style={{ 
        backgroundColor: themeBgColor, 
        color: themeTextColor 
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${themePrimaryColor};
          --text-color: ${themeTextColor};
          --text-secondary: ${renderedSettings.textColorSecondary || "#64748B"};
          --bg-color: ${themeBgColor};
        }
        
        .text-\\[\\#1877F2\\] {
          color: ${themePrimaryColor} !important;
        }
        .bg-\\[\\#1877F2\\] {
          background-color: ${themePrimaryColor} !important;
        }
        .focus\\:border-\\[\\#1877F2\\]:focus {
          border-color: ${themePrimaryColor} !important;
        }
        .btn-primary-gradient {
          background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themePrimaryColor}dd 100%) !important;
        }
        
        /* Card background adaptability */
        .bg-white {
          background-color: ${renderedSettings.customThemeMode === "dark" || renderedSettings.customThemeMode === "cosmic" ? "#151B2C" : (renderedSettings.customThemeMode === "sepia" ? "#FCF8F0" : "#FFFFFF")} !important;
        }
        .bg-slate-50 {
          background-color: ${renderedSettings.customThemeMode === "dark" || renderedSettings.customThemeMode === "cosmic" ? "#0F131E" : (renderedSettings.customThemeMode === "sepia" ? "#F5ECD8" : "#F8FAFC")} !important;
        }
        .border-slate-100, .border-slate-200, .border-gray-100 {
          border-color: ${renderedSettings.customThemeMode === "dark" || renderedSettings.customThemeMode === "cosmic" ? "#222C3E" : (renderedSettings.customThemeMode === "sepia" ? "#EADBB9" : "#E2E8F0")} !important;
        }
        .text-slate-950, .text-slate-800, .text-gray-900, .text-slate-900 {
          color: ${themeTextColor} !important;
        }
        .text-slate-600, .text-slate-500, .text-gray-600, .text-gray-500 {
          color: ${renderedSettings.textColorSecondary || "#64748B"} !important;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-smooth-ticker {
          display: flex;
          width: max-content;
          animation: marqueeScroll 25s linear infinite;
        }
        .animate-smooth-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {renderedSettings.announcementBar && (
        <div 
          className="text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors overflow-hidden select-none relative z-50 flex items-center border-b border-white/5"
          style={{ backgroundColor: themePrimaryColor }}
        >
          <div className="animate-smooth-ticker flex whitespace-nowrap gap-12 py-2.5">
            <div className="flex items-center gap-12 shrink-0">
              <span className="flex items-center gap-2">🔥 {renderedSettings.announcementBar}</span>
              <span className="flex items-center gap-2 text-white/85">⚡ ORDER ONLINE NOW TO UNLOCK CASHBACKS & OFFERS!</span>
              <span className="flex items-center gap-2 text-white/90">🌟 CUSTOM PREMIUM TAILORING & HANDMADE FINISHES</span>
              <span className="flex items-center gap-2">💫 7-DAY REPLACEMENT GUARANTEE ON SIZE RE-FITS</span>
            </div>
            <div className="flex items-center gap-12 shrink-0">
              <span className="flex items-center gap-2">🔥 {renderedSettings.announcementBar}</span>
              <span className="flex items-center gap-2 text-white/85">⚡ ORDER ONLINE NOW TO UNLOCK CASHBACKS & OFFERS!</span>
              <span className="flex items-center gap-2 text-white/90">🌟 CUSTOM PREMIUM TAILORING & HANDMADE FINISHES</span>
              <span className="flex items-center gap-2">💫 7-DAY REPLACEMENT GUARANTEE ON SIZE RE-FITS</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <Header
        currentView={view}
        setView={setView}
        setSelectedProductId={setSelectedProductId}
        user={user}
        logout={handleLogout}
        cartCount={activeCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        products={products}
        setSearchQuery={setSearchQuery}
        setFilterCategory={setFilterCategory}
        settings={renderedSettings}
      />

      {/* 3. CORE ROUTER WORKSPACE */}
      <main className="flex-1">

        {/* ================= HOME VIEW ================= */}
        {view === "home" && (
          <div className="space-y-4">
            {/* Auto Slider Banner */}
            {renderedSettings.homeSections.heroSlider && (
              <HeroSlider 
                banners={renderedSettings.bannerImages} 
                setView={setView} 
                setFilterCategory={setFilterCategory} 
              />
            )}

            {/* Feature categories grid */}
            {renderedSettings.homeSections.featuredCategories && (
              <FeaturedCategories 
                setFilterCategory={setFilterCategory} 
                setView={setView} 
              />
            )}

            {/* NEW ARRIVALS GRID */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
              <div className="text-center max-w-xl mx-auto mb-12">
                <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">FRESH CAPSULES</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">NEW ARRIVALS</h2>
                <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {products.slice(0, 4).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onQuickView={setQuickViewProduct}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={!!compareList.find(p => p.id === prod.id)}
                    setSelectedProductId={setSelectedProductId}
                    setView={setView}
                  />
                ))}
              </div>
            </section>

            {/* DELIVER FEATURE HIGHLIGHTS */}
            {renderedSettings.homeSections.deliveryFeatures && <DeliveryFeatures />}

            {/* BEST SELLERS GRID */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
              <div className="text-center max-w-xl mx-auto mb-12">
                <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">POPULAR DRAWS</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">BEST SELLERS</h2>
                <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {products.filter(p => p.bestSeller).slice(0, 4).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onQuickView={setQuickViewProduct}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={!!compareList.find(p => p.id === prod.id)}
                    setSelectedProductId={setSelectedProductId}
                    setView={setView}
                  />
                ))}
              </div>
            </section>

            {/* REVIEWS GRID */}
            {renderedSettings.homeSections.reviews && <CustomerReviewsSection />}

            {/* INSTAGRAM LOOKBOOK PORTAL */}
            {renderedSettings.homeSections.instagramGallery && <InstagramGallery />}

            {/* NEWSLETTER BULLETINS */}
            {renderedSettings.homeSections.newsletter && <NewsletterSection />}
          </div>
        )}

        {/* ================= SHOP COLLECTION VIEW ================= */}
        {view === "shop" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Catalog Grid Header with filters bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Couture Collection</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">Showing {filteredProducts.length} Premium items</p>
              </div>

              {/* Filtering Selection Inputs */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-4 font-bold focus:outline-hidden"
                >
                  <option value="all">All Wardrobe (সব পোশাক)</option>
                  <option value="shirt">Premium Shirts (শার্ট)</option>
                  <option value="t-shirt">Luxury T-Shirts (টি-শার্ট)</option>
                  <option value="polo">Polo T-Shirts (পোলো)</option>
                  <option value="pant">Premium Pants (প্যান্ট)</option>
                  <option value="genji">Trendy Genjis (গেঞ্জি/জিপার)</option>
                  <option value="others">Others (অন্যান্য)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-4 font-bold focus:outline-hidden ml-auto md:ml-0"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Popularity: Top Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Filters Workspace Column */}
              <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#1877F2]" /> Filter Shelf
                  </h3>
                  <button 
                    onClick={() => {
                      setFilterCategory("all"); setFilterSize("all");
                      setFilterColor("all"); setFilterPrice(3000);
                      setSearchQuery("");
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-[#1877F2]"
                  >
                    Reset All
                  </button>
                </div>

                {/* Instant Search input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Search Catalog</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. linen shirt, heavy tee"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#1877F2]"
                    />
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                    <span>Max Budget</span>
                    <span className="text-[#1877F2]">৳{filterPrice}</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={3000}
                    step={100}
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(Number(e.target.value))}
                    className="w-full accent-[#1877F2]"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                    <span>৳400</span>
                    <span>৳3000</span>
                  </div>
                </div>

                {/* Sizes filter list */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Fitted Size</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFilterSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          filterSize === sz
                            ? "bg-[#1877F2] text-white border-[#1877F2]"
                            : "bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors filter list */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Selective Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "#1877F2", "#000000", "#FFFFFF", "#E5E7EB", "#F59E0B"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setFilterColor(col)}
                        className={`w-7 h-7 rounded-full border-2 transition-all block ${
                          filterColor === col 
                            ? "border-[#1877F2] scale-110" 
                            : col === "all" ? "bg-slate-100 text-[9px] font-bold text-slate-500 flex items-center justify-center border-slate-200" : "border-slate-200"
                        }`}
                        style={col !== "all" ? { backgroundColor: col } : {}}
                      >
                        {col === "all" && "All"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Products list grid Column */}
              <div className="lg:col-span-9">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onQuickView={setQuickViewProduct}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.includes(prod.id)}
                        onToggleCompare={handleToggleCompare}
                        isCompared={!!compareList.find(p => p.id === prod.id)}
                        setSelectedProductId={setSelectedProductId}
                        setView={setView}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center bg-slate-50 border border-slate-100 rounded-3xl text-slate-400 text-sm">
                    No products found matching active filters criteria. Let's reset the filters and check again!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCT DETAILS VIEW ================= */}
        {view === "product-details" && selectedProductId && (
          <ProductDetails
            productId={selectedProductId}
            allProducts={products}
            token={token}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(selectedProductId)}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {/* ================= EDITORIAL LIFESTYLE BLOGS ================= */}
        {view === "blog" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">STYLING BULLETINS</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">THE COUTURE BLOG</h1>
              <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div className="relative aspect-video bg-slate-50 overflow-hidden">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-[#1877F2] font-black">{post.category}</span>
                    <h2 className="text-base font-black text-slate-800 leading-snug line-clamp-2">{post.title}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.content}</p>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mt-auto">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="text-[#1877F2] hover:underline cursor-pointer">Read Guide →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTACT VIEW ================= */}
        {view === "contact" && <ContactForm settings={renderedSettings} />}

        {/* ================= SECURE CHECKOUT PROCESS VIEW ================= */}
        {view === "checkout" && (
          <CheckoutPage
            cart={cart}
            clearCart={clearCart}
            userId={user?.id || null}
            userName={user?.name || ""}
            userPhone={user?.phone || ""}
            userEmail={user?.email || ""}
            setView={setView}
            setLastOrder={setLastOrder}
            settings={renderedSettings}
          />
        )}

        {/* ================= CUSTOMER PORTAL REGISTER & LOGIN ================= */}
        {view === "profile" && (
          <CustomerDashboard
            user={user}
            token={token}
            setAuth={handleSetAuth}
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ================= REAL-TIME ORDER TRACKING WORKSPACE ================= */}
        {view === "track-order" && (
          <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
              <div className="text-center">
                <span className="text-2xl">📦</span>
                <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight mt-3">Track Custom Order</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">Get instant updates from Pathao, RedX, SteadFast & logistics</p>
              </div>

              {/* Lookup search bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Order ID (e.g. ORDXXXX)"
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                />
                <button
                  onClick={() => handleTrackLookup()}
                  className="px-6 py-3 btn-primary-gradient text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md"
                >
                  Lookup Status
                </button>
              </div>

              {trackError && (
                <div className="p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-xl">
                  ⚠️ {trackError}
                </div>
              )}

              {/* Status Visualizer Stepper Timeline */}
              {trackedOrder && (
                <div className="border-t border-slate-100 pt-6 space-y-6 animate-scale-up">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <p className="text-slate-800">Tracking Order: <span className="font-extrabold text-[#1877F2]">{trackedOrder.id}</span></p>
                    <span className="bg-blue-50 text-[#1877F2] font-black uppercase text-[10px] px-2.5 py-1 rounded-md">
                      {trackedOrder.status}
                    </span>
                  </div>

                  {/* Delivery partner tag */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
                    <div className="flex gap-3 items-center">
                      <Truck className="w-5 h-5 text-[#1877F2]" />
                      <div>
                        <p className="text-slate-800">Courier Logistics Partner</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Custom YOUNG Style Courier Dispatch</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase">Tracking ID: TRK-YS-{trackedOrder.id}</span>
                  </div>

                  {/* Operational Stepper timeline */}
                  <div className="space-y-4 pt-4 text-xs font-semibold">
                    {[
                      { st: "pending", label: "Order Received", desc: "Order details synchronized with core warehouse." },
                      { st: "confirmed", label: "Confirmed & Approved", desc: "Fittings verified. Order locked for pack." },
                      { st: "processing", label: "Processing & QC", desc: "Double stitching and fabric quality check." },
                      { st: "packed", label: "Packed & Labelled", desc: "Enclosed in premium Young Style signature boxes." },
                      { st: "shipped", label: "Dispatched / Shipped", desc: "Handed over to local district courier partners." },
                      { st: "delivered", label: "Delivered", desc: "Couture capsule safely received at doorstep." }
                    ].map((step, idx) => {
                      const list = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
                      const currentIdx = list.indexOf(trackedOrder.status);
                      const stepIdx = list.indexOf(step.st);
                      const isCompleted = stepIdx <= currentIdx;

                      return (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] ${
                              isCompleted ? "border-[#1877F2] bg-[#1877F2] text-white" : "border-slate-200 bg-white text-slate-400"
                            }`}>
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            {idx < 5 && <div className={`w-0.5 h-10 ${isCompleted ? "bg-[#1877F2]" : "bg-slate-100"}`} />}
                          </div>
                          <div>
                            <h4 className={`font-extrabold text-xs ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>{step.label}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= OPERATIONS ADMIN PORTAL ================= */}
        {view === "admin" && (
          <AdminPanel
            products={products}
            orders={orders}
            coupons={coupons}
            blogs={blogs}
            messages={messages}
            settings={renderedSettings}
            token={token}
            onSetAuth={handleSetAuth}
            onRefreshData={loadCoreData}
          />
        )}

      </main>

      {/* 4. COMPARISON WIDGET BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 text-white p-4 animate-slide-in-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#1877F2] flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4" /> Compare Matrix ({compareList.length}/3)
              </span>
              <div className="flex gap-2">
                {compareList.map((cp) => (
                  <div key={cp.id} className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-2 border border-slate-700">
                    <span className="truncate max-w-[100px]">{cp.name}</span>
                    <button onClick={() => handleToggleCompare(cp)} className="text-red-400 hover:text-red-300 font-extrabold text-[10px]">X</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick specifications popover trigger */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert(
                    `Comparison Matrix:\n\n` + 
                    compareList.map(p => `• ${p.name}: Price ৳${p.discountPrice} | Rating: ${p.rating} | Sizes: ${p.sizes.join(", ")} | Subcategory: ${p.subcategory.toUpperCase()}`).join("\n\n")
                  );
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-lg uppercase transition-all"
              >
                View Matrix
              </button>
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-white text-xs font-black rounded-lg uppercase transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CART SLIDE-OVER DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur */}
          <div 
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col justify-between animate-slide-in-right z-10">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1877F2]" /> Shopping Cart
              </h3>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg bg-slate-50" referrerPolicy="no-referrer" />
                      
                      <div className="flex-1 space-y-1">
                        <p className="font-extrabold text-slate-800 line-clamp-2">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        
                        {/* Quantity picker */}
                        <div className="flex items-center gap-2 pt-1.5">
                          <button 
                            onClick={() => handleUpdateCartQty(idx, -1)}
                            className="w-5 h-5 bg-slate-100 text-slate-700 flex items-center justify-center rounded-sm font-black hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="font-black text-slate-800 text-xs px-1">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateCartQty(idx, 1)}
                            className="w-5 h-5 bg-slate-100 text-slate-700 flex items-center justify-center rounded-sm font-black hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between items-end shrink-0">
                        <span className="font-black text-slate-800">৳{item.price * item.quantity}</span>
                        <button 
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                  <span className="text-3xl">🛒</span>
                  <p className="text-xs font-semibold">Your shopping cart is completely empty.</p>
                  <button 
                    onClick={() => { setView("shop"); setCartOpen(false); }} 
                    className="px-6 py-2.5 bg-[#1877F2] text-white text-[11px] font-black rounded-xl uppercase tracking-wider shadow-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Cart Footer Checkout Actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Subtotal:</span>
                  <span className="text-slate-800 font-black text-sm">
                    ৳{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setView("checkout");
                    setCartOpen(false);
                  }}
                  className="w-full py-4 btn-primary-gradient text-white font-black text-xs uppercase tracking-widest rounded-xl text-center shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. QUICK VIEW OVERLAY PORTAL */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* 7. GLOBAL FOOTER */}
      <Footer 
        settings={renderedSettings} 
        setView={setView} 
        setFilterCategory={setFilterCategory} 
      />

      {/* 8. FLOATING AI HELPLINE */}
      {renderedSettings.directHelplineEnabled !== false && (
        <HelplineChat settings={renderedSettings} />
      )}
    </div>
  );
}
