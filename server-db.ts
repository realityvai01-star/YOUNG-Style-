import fs from "fs";
import path from "path";
import { hashPassword } from "./server-auth.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "admin" | "customer";
  profilePicture: string;
  addressBook: {
    division: string;
    district: string;
    area: string;
    address: string;
    postalCode: string;
  }[];
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: "shirt" | "t-shirt";
  subcategory: "casual" | "formal" | "sports" | "streetwear";
  brand: string;
  price: number;
  discountPrice: number;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  rating: number;
  reviews: Review[];
  flashSale: boolean;
  bestSeller: boolean;
  trending: boolean;
  newArrival: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Order {
  id: string;
  customerId: string | null;
  customerName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  address: string;
  postalCode: string;
  orderNote: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned" | "refunded";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  shippingCharge: number;
  couponCode?: string;
  couponDiscount?: number;
  deliveryPartner?: string;
  trackingId?: string;
  senderPhone?: string;
  transactionId?: string;
  deliveryChargeAmount?: number;
  isFake?: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  category: string;
  content: string;
  featuredImage: string;
  seoMeta: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  themeMode: "light" | "dark";
  bannerImages: {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    link: string;
  }[];
  announcementBar: string;
  homeSections: {
    heroSlider: boolean;
    promotionBar: boolean;
    featuredCategories: boolean;
    featuredProducts: boolean;
    newArrivals: boolean;
    bestSellers: boolean;
    trending: boolean;
    flashSale: boolean;
    newsletter: boolean;
    reviews: boolean;
    instagramGallery: boolean;
    deliveryFeatures: boolean;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
    whatsapp: string;
    messenger: string;
    telegram?: string;
  };
  deliveryPartners: {
    id: string;
    name: string;
    enabled: boolean;
    chargeInsideDhaka?: number;
    chargeOutsideDhaka?: number;
    estimatedDays?: string;
  }[];
  textColor?: string;
  textColorSecondary?: string;
  facebookLogoColor?: string;
  customThemeMode?: string;
  requireAdvanceDeliveryCharge?: boolean;
  deliveryChargeBkshNumber?: string;
  deliveryChargeNagadNumber?: string;
  deliveryChargeRocketNumber?: string;
  deliveryChargeInstruction?: string;
  refundPolicyText?: string;
  customerSupportPhone?: string;
  emailSupport?: string;
  supportAddress?: string;
  shopCollectionEnabled?: boolean;
  customerSystemEnabled?: boolean;
  directHelplineEnabled?: boolean;
  faqList?: { question: string; answer: string }[];
}

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  blogs: Blog[];
  messages: Message[];
  settings: WebsiteSettings;
  analytics: {
    totalVisitors: number;
    liveVisitors: number;
    dailyVisitors: { date: string; count: number }[];
    pageViews: { page: string; views: number }[];
  };
}

let dbCache: DatabaseSchema | null = null;

function loadDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const defaultDb = createDefaultSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
    dbCache = defaultDb;
    return defaultDb;
  }

  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    dbCache = JSON.parse(data);
    return dbCache!;
  } catch (err) {
    console.error("Failed to parse database, restoring defaults", err);
    const defaultDb = createDefaultSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
    dbCache = defaultDb;
    return defaultDb;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  dbCache = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save database", err);
  }
}

export function getDb(): DatabaseSchema {
  return loadDatabase();
}

function createDefaultSeedDatabase(): DatabaseSchema {
  // Seed Products with gorgeous Unsplash images
  const products: Product[] = [
    {
      id: "prod-1",
      name: "Luxury White Linen Oxford Shirt",
      description: "Made from premium Belgian linen, this breathable Oxford shirt offers a sleek structural drape. Perfect for hot summer days, beach cocktails, or polished smart-casual evening wear.",
      category: "shirt",
      subcategory: "casual",
      brand: "YOUNG Style",
      price: 2450,
      discountPrice: 1950,
      sizes: ["S", "M", "L", "XL"],
      colors: ["#FFFFFF", "#F5F5DC"],
      stock: 35,
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
        "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80"
      ],
      rating: 4.8,
      reviews: [
        { id: "rev-1", userId: "cust-2", userName: "Arif Rahman", rating: 5, comment: "Incredibly comfortable material. Fits perfectly!", createdAt: "2026-06-25T12:00:00Z" },
        { id: "rev-2", userId: "cust-3", userName: "Sadia Chowdhury", rating: 4, comment: "Very elegant shirt, but needs a bit of ironing.", createdAt: "2026-06-26T14:30:00Z" }
      ],
      flashSale: true,
      bestSeller: true,
      trending: true,
      newArrival: true,
      createdAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "prod-2",
      name: "Luxury Navy Blue Dress Shirt",
      description: "Crafted from double-ply Egyptian cotton, this crisp, formal dress shirt features non-iron tech and a elegant semi-spread collar. Ideal for corporate events, premium weddings, and luxury wear.",
      category: "shirt",
      subcategory: "formal",
      brand: "YOUNG Style Premium",
      price: 2950,
      discountPrice: 2450,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["#000080", "#1E3A8A"],
      stock: 40,
      images: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"
      ],
      rating: 4.9,
      reviews: [
        { id: "rev-3", userId: "cust-4", userName: "Tanvir Ahmed", rating: 5, comment: "Premium stitching. The fabric feels amazing on the skin.", createdAt: "2026-06-28T09:15:00Z" }
      ],
      flashSale: false,
      bestSeller: true,
      trending: true,
      newArrival: false,
      createdAt: "2026-06-02T10:00:00Z"
    },
    {
      id: "prod-3",
      name: "Vintage Indigo Denim Chambray Shirt",
      description: "Rugged yet soft. This denim chambray shirt is enzyme-washed for a vintage worn-in feel. Tailored with double-needle stitching and twin buttoned chest pockets.",
      category: "shirt",
      subcategory: "casual",
      brand: "YOUNG Style Denim",
      price: 1850,
      discountPrice: 1650,
      sizes: ["S", "M", "L"],
      colors: ["#4682B4", "#2B6CB0"],
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"
      ],
      rating: 4.6,
      reviews: [],
      flashSale: true,
      bestSeller: false,
      trending: true,
      newArrival: true,
      createdAt: "2026-06-15T11:00:00Z"
    },
    {
      id: "prod-4",
      name: "Classic Charcoal Grey Heavyweight Tee",
      description: "A heavyweight t-shirt engineered from 100% carded organic cotton. Built with a robust ribbed crewneck collar and drop-shoulder streetwear fit.",
      category: "t-shirt",
      subcategory: "streetwear",
      brand: "YOUNG Style",
      price: 1250,
      discountPrice: 990,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["#4A5568", "#1A202C"],
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80"
      ],
      rating: 4.7,
      reviews: [
        { id: "rev-4", userId: "cust-2", userName: "Arif Rahman", rating: 5, comment: "The thickness of this t-shirt is amazing. Durable!", createdAt: "2026-06-24T18:00:00Z" }
      ],
      flashSale: true,
      bestSeller: true,
      trending: true,
      newArrival: true,
      createdAt: "2026-06-10T12:00:00Z"
    },
    {
      id: "prod-5",
      name: "Classic Jet Black Cotton T-Shirt",
      description: "The ultimate minimalist tee. Handcrafted from ultra-soft combed cotton with a touch of elastane for structural stretch. Pre-shrunk and double-stitched.",
      category: "t-shirt",
      subcategory: "casual",
      brand: "YOUNG Basic",
      price: 990,
      discountPrice: 790,
      sizes: ["S", "M", "L", "XL"],
      colors: ["#000000"],
      stock: 12, // Low stock for alert demonstration!
      images: [
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80"
      ],
      rating: 4.5,
      reviews: [],
      flashSale: false,
      bestSeller: true,
      trending: false,
      newArrival: false,
      createdAt: "2026-06-05T08:00:00Z"
    },
    {
      id: "prod-6",
      name: "Athletic Crimson Tech-Fit Tee",
      description: "Dry-fit tech shirt featuring flatlock anti-chafing seams and strategic underarm ventilation mesh. Designed to stay cool, fresh, and flexible during peak performance.",
      category: "t-shirt",
      subcategory: "sports",
      brand: "YOUNG Active",
      price: 1350,
      discountPrice: 1150,
      sizes: ["S", "M", "L", "XL"],
      colors: ["#DC2626", "#1E293B"],
      stock: 60,
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
      ],
      rating: 4.4,
      reviews: [],
      flashSale: false,
      bestSeller: false,
      trending: true,
      newArrival: true,
      createdAt: "2026-06-20T14:00:00Z"
    }
  ];

  // Seed Blogs with rich fashion content
  const blogs: Blog[] = [
    {
      id: "blog-1",
      title: "How to Style a White Linen Oxford Shirt for Any Occasion",
      category: "Styling Guides",
      content: "The white linen shirt is a seasonal powerhouse, but with a bit of styling imagination, it can stretch far beyond standard beachwear. In this post, we explore five distinct ways to wear it: 1) Smart Casual Corporate (paired with tan trousers and chocolate brown loafers), 2) Effortless Weekend (layered open over a jet-black crewneck t-shirt with charcoal denim), 3) Riviera Lounge (with pastel shorts and espadrilles), 4) Street Avant-Garde (half-tucked into oversized utility pants), and 5) Night Out Luxury (accessorized with silver chains and rolled-up cuffs). Focus on high-quality fabric construction for the best drape.",
      featuredImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80",
      seoMeta: {
        metaTitle: "White Linen Shirt Styling Guide - YOUNG Style Blog",
        metaDescription: "Discover 5 modern ways to style a premium white linen Oxford shirt for smart-casual corporate, Riviera lounges, and streetwear looks.",
        keywords: ["linen shirt styling", "men's fashion", "smart casual white shirt", "how to style oxford shirt"]
      },
      createdAt: "2026-06-20T09:00:00Z"
    },
    {
      id: "blog-2",
      title: "The Return of Heavyweight Cotton: Streetwear's Obsession",
      category: "Fashion Trends",
      content: "If you have purchased a fast-fashion t-shirt in the last decade, you've likely noticed how quickly they warp, thin out, and lose shape after a single cold wash. Enter heavyweight cotton. Ranging from 220GSM to 300GSM, heavyweight carded cotton is making a massive, streetwear-led resurgence. In this deep dive, we break down why modern connoisseurs prefer heavier drapes. Heavyweight cotton holds structural shape, drops cleanly off the shoulders for an organic oversized silhouette, and possesses outstanding lifetime durability. Learn how to identify genuine organic ringspun yarns.",
      featuredImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=80",
      seoMeta: {
        metaTitle: "Why Heavyweight T-Shirts Are Dominating Streetwear - YOUNG Style",
        metaDescription: "Learn about the heavyweight carded cotton trend (220-300GSM) in modern streetwear, organic yarns, and why heavyweight tees are a wardrobe essential.",
        keywords: ["heavyweight cotton t-shirt", "streetwear trends", "cotton GSM explained", "minimalist fashion tee"]
      },
      createdAt: "2026-06-25T11:30:00Z"
    }
  ];

  // Seed default website settings
  const settings: WebsiteSettings = {
    websiteName: "YOUNG Style",
    tagline: "Premium Shirt & T-Shirt Collection",
    primaryColor: "#1877F2", // Facebook Blue
    secondaryColor: "#000000", // Black
    buttonColor: "#1877F2",
    backgroundColor: "#FFFFFF",
    themeMode: "light",
    bannerImages: [
      {
        id: "banner-1",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&q=80",
        title: "ELEVATE YOUR CLASS",
        subtitle: "Luxury Linen & Oxford Shirts Handcrafted with Pure Egyptian Cotton",
        link: "/shop?category=shirt"
      },
      {
        id: "banner-2",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&q=80",
        title: "STREETWEAR BASICS",
        subtitle: "Premium Heavyweight Cotton Tees Designed for Absolute Comfort & Drape",
        link: "/shop?category=t-shirt"
      }
    ],
    announcementBar: "⚡ Flat 15% OFF on all credit card & mobile wallet purchases! Use Code: YOUNG15 ⚡",
    homeSections: {
      heroSlider: true,
      promotionBar: true,
      featuredCategories: true,
      featuredProducts: true,
      newArrivals: true,
      bestSellers: true,
      trending: true,
      flashSale: true,
      newsletter: true,
      reviews: true,
      instagramGallery: true,
      deliveryFeatures: true
    },
    socialLinks: {
      facebook: "https://facebook.com/youngstyle",
      instagram: "https://instagram.com/youngstyle",
      youtube: "https://youtube.com/youngstyle",
      tiktok: "https://tiktok.com/@youngstyle",
      linkedin: "https://linkedin.com/company/youngstyle",
      whatsapp: "https://wa.me/8801700000000",
      messenger: "https://m.me/youngstyle",
      telegram: "https://t.me/youngstyle"
    },
    deliveryPartners: [
      { id: "pathao", name: "Pathao Delivery", enabled: true, chargeInsideDhaka: 60, chargeOutsideDhaka: 120, estimatedDays: "2-3 Days" },
      { id: "steadfast", name: "SteadFast Courier", enabled: true, chargeInsideDhaka: 80, chargeOutsideDhaka: 150, estimatedDays: "1-2 Days" },
      { id: "redx", name: "RedX", enabled: false, chargeInsideDhaka: 70, chargeOutsideDhaka: 130, estimatedDays: "3-4 Days" },
      { id: "paperfly", name: "Paperfly", enabled: false, chargeInsideDhaka: 65, chargeOutsideDhaka: 135, estimatedDays: "3-5 Days" },
      { id: "sundarban", name: "Sundarban Courier", enabled: true, chargeInsideDhaka: 90, chargeOutsideDhaka: 160, estimatedDays: "2-4 Days" }
    ],
    requireAdvanceDeliveryCharge: true,
    deliveryChargeBkshNumber: "01755-123456",
    deliveryChargeNagadNumber: "01911-654321",
    deliveryChargeRocketNumber: "01822-789012",
    deliveryChargeInstruction: "অর্ডারটি নিশ্চিত করার জন্য ডেলিভারি চার্জ অগ্রিম পরিশোধ করতে হবে। নিচের যেকোনো একটি নম্বরে ডেলিভারি চার্জ (ঢাকায় ৬০ টাকা, ঢাকার বাইরে ১২০ টাকা) Send Money করুন এবং ট্রানজেকশন আইডি (TxnID) অথবা আপনার বিকাশ/নগদ/রকেট নম্বরটি নিচে প্রদান করুন।",
    refundPolicyText: "১২ ঘণ্টার মধ্যে পরিবর্তন প্রযোজ্য। যেকোনো সাইজ বা কালার সংক্রান্ত ভুলের জন্য ৭ দিনের মধ্যে প্রোডাক্ট রিপ্লেসমেন্ট পাবেন। কোনো চার্জ কাটা হবে না।",
    customerSupportPhone: "01700-000000",
    emailSupport: "support@youngstyle.com",
    supportAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230",
    shopCollectionEnabled: true,
    customerSystemEnabled: true,
    directHelplineEnabled: true,
    faqList: [
      { question: "ডেলিভারি চার্জ কেন অগ্রিম দিতে হবে?", answer: "ফেইক অর্ডার এড়াতে এবং দ্রুত ডেলিভারি প্রসেসিংয়ের স্বার্থে ডেলিভারি চার্জ অগ্রিম নেওয়া হয়।" },
      { question: "প্রোডাক্টের সাইজ না মিললে কি পরিবর্তন করা যাবে?", answer: "হ্যাঁ, প্রোডাক্ট রিসিভ করার ৭ দিনের মধ্যে যেকোনো সাইজ বা কালার পরিবর্তন করে নিতে পারবেন।" },
      { question: "ডেলিভারি সময় কতদিন লাগে?", answer: "ঢাকা সিটির ভেতরে ১-২ দিন এবং ঢাকার বাইরে ২-৩ দিনের মধ্যে হোম ডেলিভারি করা হয়।" }
    ]
  };

  // Seed default Coupons
  const coupons: Coupon[] = [
    {
      id: "coup-1",
      code: "YOUNG15",
      type: "percentage",
      value: 15,
      expiryDate: "2027-12-31",
      usageLimit: 1000,
      usedCount: 14,
      status: "active",
      createdAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "coup-2",
      code: "YOUNGFLAT300",
      type: "fixed",
      value: 300,
      expiryDate: "2027-12-31",
      usageLimit: 500,
      usedCount: 5,
      status: "active",
      createdAt: "2026-06-02T11:00:00Z"
    }
  ];

  // Seed Default Analytics
  const analytics = {
    totalVisitors: 8420,
    liveVisitors: 14,
    dailyVisitors: [
      { date: "24-Jun", count: 280 },
      { date: "25-Jun", count: 310 },
      { date: "26-Jun", count: 295 },
      { date: "27-Jun", count: 350 },
      { date: "28-Jun", count: 420 },
      { date: "29-Jun", count: 480 },
      { date: "30-Jun", count: 520 }
    ],
    pageViews: [
      { page: "Home", views: 12450 },
      { page: "Shop All", views: 9810 },
      { page: "Shirt Details", views: 6320 },
      { page: "T-Shirt Details", views: 5120 },
      { page: "Checkout", views: 1840 },
      { page: "Order Tracking", views: 760 },
      { page: "Blog", views: 1250 }
    ]
  };

  // Create Users (with hashed password for admin and standard customers)
  const users: User[] = [
    {
      id: "admin-1",
      name: "YOUNG Style",
      email: "admin@youngstyle.com", // For login convenience
      phone: "01711111111",
      passwordHash: hashPassword("8tmI@mr87"), // Seed password exactly as requested!
      role: "admin",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      addressBook: [],
      createdAt: "2026-06-01T00:00:00Z"
    },
    {
      id: "cust-2",
      name: "Arif Rahman",
      email: "arif@example.com",
      phone: "01822222222",
      passwordHash: hashPassword("customer123"),
      role: "customer",
      profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
      addressBook: [
        {
          division: "Dhaka",
          district: "Dhaka",
          area: "Gulshan-2",
          address: "House 12, Road 45, Sector 5",
          postalCode: "1212"
        }
      ],
      createdAt: "2026-06-10T12:00:00Z"
    }
  ];

  // Seed sample Orders
  const orders: Order[] = [
    {
      id: "ORD-9831",
      customerId: "cust-2",
      customerName: "Arif Rahman",
      phone: "01822222222",
      email: "arif@example.com",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan-2",
      address: "House 12, Road 45, Sector 5",
      postalCode: "1212",
      orderNote: "Please deliver before evening if possible. Thank you!",
      items: [
        {
          productId: "prod-1",
          name: "Luxury White Linen Oxford Shirt",
          price: 1950,
          quantity: 1,
          selectedSize: "M",
          selectedColor: "#FFFFFF",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&q=80"
        },
        {
          productId: "prod-4",
          name: "Classic Charcoal Grey Heavyweight Tee",
          price: 990,
          quantity: 1,
          selectedSize: "L",
          selectedColor: "#4A5568",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&q=80"
        }
      ],
      total: 2940, // 1950 + 990 = 2940
      status: "processing",
      paymentMethod: "bKash",
      paymentStatus: "paid",
      shippingCharge: 60,
      deliveryPartner: "Pathao Delivery",
      trackingId: "PTH-7781203",
      createdAt: "2026-06-30T10:15:00Z"
    },
    {
      id: "ORD-9820",
      customerId: null,
      customerName: "Nusrat Jahan",
      phone: "01933333333",
      email: "nusrat@example.com",
      division: "Chittagong",
      district: "Chittagong",
      area: "Nasirabad",
      address: "Lane 2, Block B, House 4",
      postalCode: "4000",
      orderNote: "",
      items: [
        {
          productId: "prod-2",
          name: "Luxury Navy Blue Dress Shirt",
          price: 2450,
          quantity: 1,
          selectedSize: "L",
          selectedColor: "#000080",
          image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=150&q=80"
        }
      ],
      total: 2570, // 2450 + 120 shipping = 2570
      status: "pending",
      paymentMethod: "Cash On Delivery",
      paymentStatus: "pending",
      shippingCharge: 120,
      createdAt: "2026-06-30T14:45:00Z"
    }
  ];

  return {
    users,
    products,
    orders,
    coupons,
    blogs,
    messages: [
      {
        id: "msg-1",
        name: "Fahim Shahriar",
        email: "fahim@example.com",
        phone: "01677777777",
        subject: "Bulk Order Query for Event",
        message: "Hello, I am looking to purchase 150 pieces of Classic Jet Black Cotton T-Shirts for our university club event. Do you offer bulk discounts, and can you custom-print a logo? Please let me know the pricing and delivery timeline. Thanks!",
        status: "unread",
        createdAt: "2026-06-29T16:20:00Z"
      }
    ],
    settings,
    analytics
  };
}
