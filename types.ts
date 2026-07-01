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
  videoUrl?: string;
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
  websiteLogo?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  profilePicture: string;
  addressBook: {
    division: string;
    district: string;
    area: string;
    address: string;
    postalCode: string;
  }[];
}
