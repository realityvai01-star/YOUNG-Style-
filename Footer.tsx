import React from "react";
import { 
  Facebook, Instagram, Youtube, Phone, Mail, MapPin, Send, MessageCircle 
} from "lucide-react";
import { WebsiteSettings } from "../types";

interface FooterProps {
  settings: WebsiteSettings;
  setView: (view: string) => void;
  setFilterCategory: (cat: "all" | "shirt" | "t-shirt") => void;
}

export default function Footer({ settings, setView, setFilterCategory }: FooterProps) {
  const handleCategoryNav = (cat: "shirt" | "t-shirt") => {
    setFilterCategory(cat);
    setView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (view: string) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      {/* Top Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Intro Column */}
          <div className="flex flex-col gap-4">
            <div className="cursor-pointer" onClick={() => handleNav("home")}>
              <span className="text-2xl font-black tracking-tight text-[#1877F2]">
                YOUNG <span className="text-white font-light">Style</span>
              </span>
              <p className="text-[9px] tracking-widest text-slate-500 font-bold uppercase mt-0.5">
                {settings.tagline || "Premium Shirt & T-Shirt Collection"}
              </p>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Discover ultimate refinement with our modern, premium shirts and heavyweight streetwear tees. Handcrafted tailoring combined with pure organic yarns.
            </p>

            {/* Social Links Panel */}
            <div className="flex items-center gap-3.5 mt-4">
              {settings.socialLinks.facebook && (
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-500 hover:border-pink-500 transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a 
                  href={settings.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.whatsapp && (
                <a 
                  href={settings.socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500 transition-all"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.telegram && (
                <a 
                  href={settings.socialLinks.telegram.startsWith("http") ? settings.socialLinks.telegram : `https://t.me/${settings.socialLinks.telegram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-500 transition-all"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Catalog Columns */}
          {settings.shopCollectionEnabled !== false && (
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#1877F2] pl-3">
                SHOP COLLECTION
              </h4>
              <ul className="space-y-3.5 text-xs font-semibold">
                <li>
                  <button onClick={() => { setFilterCategory("all"); handleNav("shop"); }} className="hover:text-[#1877F2] transition-colors">
                    View All Collections
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryNav("shirt")} className="hover:text-[#1877F2] transition-colors">
                    👔 Premium Formal & Casual Shirts
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryNav("t-shirt")} className="hover:text-[#1877F2] transition-colors">
                    👕 Heavyweight Graphics & T-Shirts
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryNav("shirt")} className="hover:text-[#1877F2] transition-colors">
                    🔥 New Arrival & Best Sellers
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav("blog")} className="hover:text-[#1877F2] transition-colors">
                    📰 Latest Fashion Blog & Styling
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Quick Support Links */}
          {settings.customerSystemEnabled !== false && (
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#1877F2] pl-3">
                CUSTOMER SYSTEM
              </h4>
              <ul className="space-y-3.5 text-xs font-semibold">
                <li>
                  <button onClick={() => handleNav("profile")} className="hover:text-[#1877F2] transition-colors">
                    My Profile Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav("track-order")} className="hover:text-[#1877F2] transition-colors">
                    📦 Real-time Order Tracking
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav("contact")} className="hover:text-[#1877F2] transition-colors">
                    Contact Support Helpline
                  </button>
                </li>
                <li>
                  <a href="#return-policy" className="hover:text-[#1877F2] transition-colors">
                    7-Day Replacement Policy
                  </a>
                </li>
                <li>
                  <a href="#delivery-charges" className="hover:text-[#1877F2] transition-colors">
                    Shipping Rates & Delivery Partners
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Contact Details Column */}
          {settings.directHelplineEnabled !== false && (
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#1877F2] pl-3">
                DIRECT HELPLINE
              </h4>
              <ul className="space-y-4 text-xs font-semibold">
                <li className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-[#1877F2] shrink-0" />
                  <span className="leading-relaxed">
                    {settings.supportAddress || "House 45, Road 12, Sector 5, Uttara, Dhaka-1230, Bangladesh"}
                  </span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone className="w-4 h-4 text-[#1877F2]" />
                  <a href={`tel:${settings?.customerSupportPhone || "+8801711111111"}`} className="hover:text-[#1877F2] transition-colors">
                    {settings?.customerSupportPhone || "+880 1711-111111"} (10 AM - 10 PM)
                  </a>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail className="w-4 h-4 text-[#1877F2]" />
                  <a href={`mailto:${settings?.emailSupport || "support@youngstyle.com"}`} className="hover:text-[#1877F2] transition-colors">
                    {settings?.emailSupport || "support@youngstyle.com"}
                  </a>
                </li>
              </ul>
              {/* Quick Interactive Widgets */}
              <div className="mt-6 flex flex-wrap gap-2">
                {settings.socialLinks.whatsapp && (
                  <a 
                    href={settings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-black text-[11px] px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-xs uppercase transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Chat
                  </a>
                )}
                {settings.socialLinks.telegram && (
                  <a 
                    href={settings.socialLinks.telegram.startsWith("http") ? settings.socialLinks.telegram : `https://t.me/${settings.socialLinks.telegram}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-black text-[11px] px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-xs uppercase transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Telegram Channel
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-slate-950 border-t border-slate-900/60 py-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>
            © 2026 <span className="text-[#1877F2] font-bold">YOUNG Style</span>. All rights reserved. Premium Clothing Co.
          </span>
          <div className="flex gap-4 font-semibold">
            <a href="#privacy" className="hover:underline hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:underline hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
