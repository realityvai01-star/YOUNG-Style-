import React, { useState } from "react";
import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowRight, Instagram } from "lucide-react";

interface FeaturedCategoriesProps {
  setFilterCategory: (cat: "all" | "shirt" | "t-shirt") => void;
  setView: (view: string) => void;
}

export function FeaturedCategories({ setFilterCategory, setView }: FeaturedCategoriesProps) {
  const categories = [
    {
      id: "shirt",
      title: "PREMIUM SHIRTS",
      subtitle: "Linen, Oxford & Formal Wear",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
      link: "shirt"
    },
    {
      id: "t-shirt",
      title: "LUXURY T-SHIRTS",
      subtitle: "Heavyweight Cotton & Streetwear",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
      link: "t-shirt"
    }
  ];

  const handleCategoryClick = (cat: "shirt" | "t-shirt") => {
    setFilterCategory(cat);
    setView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">STYLISH FABRICS</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">FEATURED CATEGORIES</h2>
          <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id as "shirt" | "t-shirt")}
              className="group relative h-[300px] sm:h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent transition-opacity duration-300 group-hover:from-slate-950/90" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight uppercase">{cat.title}</h3>
                  <p className="text-slate-200 text-sm mt-1">{cat.subtitle}</p>
                </div>
                <span className="bg-[#1877F2] text-white p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliveryFeatures() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#1877F2]" />,
      title: "Super Fast Delivery",
      description: "Fast doorstep delivery across all districts inside Bangladesh."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#1877F2]" />,
      title: "Secure Checkout",
      description: "SSL Encrypted mobile wallets, cards, and bank transactions."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#1877F2]" />,
      title: "Easy 7-Day Returns",
      description: "Exchanges or refunds with absolutely zero hassle."
    },
    {
      icon: <Headphones className="w-8 h-8 text-[#1877F2]" />,
      title: "Premium Live Support",
      description: "Direct assistance via WhatsApp, Phone, & Messenger."
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <div key={index} className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-3xs">
              <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                {feat.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{feat.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomerReviewsSection() {
  const reviews = [
    {
      name: "Tariqul Islam",
      role: "Verified Buyer",
      rating: 5,
      comment: "Absolutely stunned by the luxury feel of the Linen shirt! The Oxford-style drape holds its structure wonderfully even in humid weather. YOUNG Style has become my go-to premium shirt brand.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Samin Al-Hasan",
      role: "Verified Buyer",
      rating: 5,
      comment: "The Heavyweight Charcoal Tee exceeded my expectations. Extremely thick, perfect oversized drop-shoulder fit, and didn't shrink or lose shape in the washing machine. Highly recommend for streetwear fans!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    {
      name: "Farah Tabassum",
      role: "Verified Buyer",
      rating: 5,
      comment: "Bought a formal shirt for my husband's presentation. Fits cleanly on the shoulder and looks like a high-end international clothing brand. Shipping was very fast too!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">TESTIMONIALS</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">HEAR FROM OUR CUSTOMERS</h2>
          <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed italic">"{rev.comment}"</p>
              </div>
              
              <div className="flex gap-3 items-center mt-6 pt-6 border-t border-slate-100">
                <img src={rev.image} alt={rev.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramGallery() {
  const images = [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">#YOUNGSTYLELOOK</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Instagram className="w-6 h-6 text-pink-600" /> INSTAGRAM GALLERY
          </h2>
          <p className="text-slate-500 text-xs mt-2">Tag us on Instagram to get featured in our seasonal lookbooks!</p>
          <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-50 shadow-3xs cursor-pointer">
              <img src={img} alt="Style Showcase" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(() => {
    const base = Number(localStorage.getItem("ys_subscriber_count")) || 14832;
    return base;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    const newCount = subscriberCount + 1;
    setSubscriberCount(newCount);
    localStorage.setItem("ys_subscriber_count", String(newCount));
    setEmail("");
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Absolute design accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">JOIN THE COUTURE INSIDERS</h2>
        <p className="text-slate-300 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
          Subscribe to our premium lifestyle bulletin. Unlock secret 15% discount vouchers, trend summaries, and first-access capsules.
        </p>

        {/* Beautiful Live Subscriber Count Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 mb-2 text-xs font-semibold text-slate-300">
          <div className="flex -space-x-2.5 overflow-hidden">
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Couture Member" referrerPolicy="no-referrer" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Couture Member" referrerPolicy="no-referrer" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Couture Member" referrerPolicy="no-referrer" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop" alt="Couture Member" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-extrabold text-sm sm:text-base tracking-tight">{subscriberCount.toLocaleString()}+</span>
              <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Customers Subscribed</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">🟢 Live Community Subscriber Counter (সরাসরি সাবস্ক্রাইবার সংখ্যা)</p>
          </div>
        </div>

        {subscribed ? (
          <div className="mt-8 p-5 bg-blue-950/70 border border-blue-500/40 rounded-2xl max-w-md mx-auto animate-scale-up">
            <p className="text-sm font-bold text-blue-200">🎉 Subscription Activated!</p>
            <p className="text-xs text-slate-300 mt-1">Please check your inbox. We've dispatched your 15% discount coupon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800 border border-slate-700 focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-sm text-white placeholder-slate-400 focus:outline-hidden"
              required
            />
            <button
              type="submit"
              className="btn-primary-gradient text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-blue-500/10 uppercase tracking-wider shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
