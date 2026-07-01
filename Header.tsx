import React, { useState } from "react";
import { 
  Menu, X, Search, ShoppingBag, Heart, User as UserIcon, LogOut, ChevronDown, BarChart2, MessageSquare, Settings, FileText
} from "lucide-react";
import { User, Product, WebsiteSettings } from "../types";

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
  user: User | null;
  logout: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  products: Product[];
  setSearchQuery: (query: string) => void;
  setFilterCategory: (cat: "all" | "shirt" | "t-shirt") => void;
  settings?: WebsiteSettings | null;
}

export default function Header({
  currentView,
  setView,
  setSelectedProductId,
  user,
  logout,
  cartCount,
  wishlistCount,
  onOpenCart,
  products,
  setSearchQuery,
  setFilterCategory,
  settings
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setFilterCategory("all");
    setView("shop");
    setSearchOpen(false);
  };

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    setView("product-details");
    setSearchOpen(false);
    setSearchVal("");
  };

  const filteredSuggestions = searchVal.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase())).slice(0, 5)
    : [];

  const navItems = [
    { label: "Home", view: "home" },
    ...(settings?.shopCollectionEnabled !== false ? [{ label: "Shop", view: "shop" }] : []),
    { label: "Blog", view: "blog" },
    { label: "Contact", view: "contact" },
    ...(user?.role === "admin" ? [{ label: "Admin Portal", view: "admin" }] : [])
  ];

  const navigateTo = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-4">
              <button 
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-800 focus:outline-hidden"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div 
                onClick={() => { setView("home"); setSelectedProductId(null); }} 
                className="cursor-pointer flex items-center gap-2.5"
              >
                {settings?.websiteLogo ? (
                  <img 
                    src={settings.websiteLogo} 
                    alt={settings.websiteName || "Logo"} 
                    className="h-10 w-auto object-contain rounded-md" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 flex items-center justify-center rounded-xl shadow-xs transition-all hover:rotate-3"
                    style={{ backgroundColor: settings?.primaryColor || "#1877F2" }}
                  >
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1877F2]">
                    {settings?.websiteName ? (
                      settings.websiteName
                    ) : (
                      <>YOUNG <span className="text-slate-900 font-light">Style</span></>
                    )}
                  </span>
                  <span className="text-[9px] tracking-widest text-slate-400 font-medium uppercase -mt-0.5">
                    {settings?.tagline || "PREMIUM COLLECTION"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    if (item.view === "shop") setFilterCategory("all");
                    navigateTo(item.view);
                  }}
                  className={`text-sm font-semibold transition-colors duration-200 py-2 relative ${
                    currentView === item.view 
                      ? "text-[#1877F2]" 
                      : "text-slate-600 hover:text-[#1877F2]"
                  }`}
                >
                  {item.label}
                  {currentView === item.view && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right: Search, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                id="search-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-[#1877F2] hover:bg-slate-50 rounded-full transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              <button 
                id="wishlist-btn"
                onClick={() => navigateTo("profile")}
                className="relative p-2 text-slate-600 hover:text-[#1877F2] hover:bg-slate-50 rounded-full transition-all duration-200"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                id="cart-btn"
                onClick={onOpenCart}
                className="relative p-2 text-slate-600 hover:text-[#1877F2] hover:bg-slate-50 rounded-full transition-all duration-200 mr-1"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1877F2] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                {user ? (
                  <div className="flex items-center gap-1">
                    <button
                      id="profile-dropdown-toggle"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 border border-slate-100 transition-all duration-200"
                    >
                      <img 
                        src={user.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="hidden lg:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-semibold text-slate-400 uppercase">Logged in as</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        
                        <button
                          onClick={() => { setProfileDropdownOpen(false); navigateTo("profile"); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          My Account Dashboard
                        </button>

                        <button
                          onClick={() => { setProfileDropdownOpen(false); navigateTo("track-order"); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left transition-colors"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          Track My Order
                        </button>

                        {user.role === "admin" && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); navigateTo("admin"); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#1877F2] hover:bg-blue-50 text-left font-semibold transition-colors"
                          >
                            <BarChart2 className="w-4 h-4" />
                            Admin Panel
                          </button>
                        )}

                        <div className="border-t border-slate-100 mt-2 pt-2">
                          <button
                            onClick={() => { setProfileDropdownOpen(false); logout(); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigateTo("profile")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1877F2] text-xs font-bold text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-xs"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Sidebar drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl h-full animate-slide-in-left">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white bg-slate-950 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo area */}
            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50 flex flex-col">
              <span className="text-xl font-black text-[#1877F2]">
                YOUNG <span className="text-slate-900 font-light">Style</span>
              </span>
              <span className="text-[8px] tracking-widest text-slate-400 font-bold uppercase mt-0.5">
                Premium Clothing Brand
              </span>
            </div>

              {/* Navigation options */}
              <div className="flex-1 h-0 overflow-y-auto px-4 py-4 space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
                
                <button 
                  onClick={() => navigateTo("home")} 
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "home" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Home
                </button>

                {settings?.shopCollectionEnabled !== false && (
                  <>
                    <button 
                      onClick={() => { setFilterCategory("all"); navigateTo("shop"); }} 
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "shop" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      Shop All
                    </button>

                    <button 
                      onClick={() => { setFilterCategory("shirt"); navigateTo("shop"); }} 
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      👔 Premium Shirts
                    </button>

                    <button 
                      onClick={() => { setFilterCategory("t-shirt"); navigateTo("shop"); }} 
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      👕 Luxury T-Shirts
                    </button>
                  </>
                )}

                <button 
                  onClick={() => navigateTo("blog")} 
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "blog" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Blog & News
                </button>

                <button 
                  onClick={() => navigateTo("contact")} 
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "contact" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  Contact Support
                </button>

                {(settings?.customerSystemEnabled !== false || user?.role === "admin") && (
                  <>
                    <div className="border-t border-slate-100 my-4 pt-4" />
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">My Account</p>

                    <button 
                      onClick={() => navigateTo("profile")} 
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "profile" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Dashboard / Account
                    </button>

                    <button 
                      onClick={() => navigateTo("track-order")} 
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "track-order" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      Track Order
                    </button>
                  </>
                )}

                <button 
                  onClick={() => navigateTo("admin")} 
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all ${currentView === "admin" ? "bg-blue-50 text-[#1877F2]" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  <BarChart2 className="w-4 h-4 text-[#1877F2]" />
                  <div className="flex flex-col">
                    <span className="font-bold">Admin Portal</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pass: 8tmI@mr87</span>
                  </div>
                </button>

              {user && (
                <button 
                  onClick={() => { setMobileMenuOpen(false); logout(); }} 
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH INSTANT OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex justify-center p-4 sm:p-10">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl h-fit overflow-hidden mt-10 animate-scale-up">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search premium shirts, graphics, streetwear..."
                  value={searchVal}
                  onChange={handleSearchChange}
                  className="w-full border-0 focus:ring-0 text-slate-800 text-base font-medium placeholder-slate-400 py-1 focus:outline-hidden"
                  autoFocus
                />
              </form>
              <button 
                onClick={() => { setSearchOpen(false); setSearchVal(""); }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions */}
            {searchVal.trim() && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 flex justify-between items-center">
                <span>Instant Recommendations</span>
                <span>Press Enter to view all</span>
              </div>
            )}

            <div className="max-h-[350px] overflow-y-auto">
              {searchVal.trim() ? (
                filteredSuggestions.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredSuggestions.map((prod) => (
                      <div 
                        key={prod.id} 
                        onClick={() => selectProduct(prod.id)}
                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{prod.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{prod.category} - {prod.subcategory}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#1877F2]">৳{prod.discountPrice}</span>
                          {prod.price > prod.discountPrice && (
                            <p className="text-xs text-slate-400 line-through">৳{prod.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No items found matching "<span className="font-semibold text-slate-700">{searchVal}</span>"
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Type something to search our luxury collection...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
