import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, Lock, Mail, Phone, ShoppingCart, Key, MapPin, 
  Settings, Heart, Trash2, Printer, Search, Plus, Eye, KeyRound, ShieldCheck
} from "lucide-react";
import { User, Order, Product } from "../types";

interface CustomerDashboardProps {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function CustomerDashboard({
  user,
  token,
  setAuth,
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart
}: CustomerDashboardProps) {
  // Auth view switcher
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);

  // Social Login States
  const [showSocialModal, setShowSocialModal] = useState<"Google" | "Facebook" | null>(null);
  const [customSocialEmail, setCustomSocialEmail] = useState("");
  const [customSocialName, setCustomSocialName] = useState("");

  const handleSocialSubmit = async (provider: "Google" | "Facebook", emailToUse: string, nameToUse: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: nameToUse || (provider === "Google" ? "Google User" : "Facebook User"),
          email: emailToUse,
          profilePicture: provider === "Google" 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Social authentication failed");
      }
      setAuth(data.user, data.token);
      setShowSocialModal(null);
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong during social login");
    } finally {
      setLoading(false);
    }
  };

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"summary" | "orders" | "wishlist" | "addresses" | "settings">("summary");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Address creation
  const [newAddress, setNewAddress] = useState({ division: "Dhaka", district: "", area: "", address: "", postalCode: "" });
  const [addressSuccess, setAddressSuccess] = useState("");

  // Update profile
  const [pfpUrl, setPfpUrl] = useState(user?.profilePicture || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/orders/my-orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setLoading(true);

    const url = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = authMode === "login" 
      ? { email, password } 
      : { name, email, phone, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (authMode === "register") {
        setOtpSent(true);
        setVerificationPending(true);
        setAuthSuccess("🎉 Registration initialized! OTP has been sent to your email/phone.");
      } else {
        setAuth(data.user, data.token);
      }
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "OTP code invalid");
      }

      setAuth(data.user, data.token);
      setVerificationPending(false);
      setOtpSent(false);
    } catch (err: any) {
      setAuthError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSuccess("");
    try {
      const res = await fetch("/api/auth/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (res.ok) {
        setAddressSuccess("🎉 Sizing address recorded!");
        setNewAddress({ division: "Dhaka", district: "", area: "", address: "", postalCode: "" });
        setAuth(data.user, token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccess("");
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ profilePicture: pfpUrl, oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Profile settings modification failed");
      }
      setAuthSuccess("🎉 Profile security configuration updated!");
      setOldPassword("");
      setNewPassword("");
      setAuth(data.user, token);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auth Portal UI
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        {/* Social Sign-In Modal Overlay */}
        {showSocialModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-100 shadow-2xl relative animate-scale-up text-center">
              <button
                type="button"
                onClick={() => setShowSocialModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>

              {showSocialModal === "Google" ? (
                <div className="space-y-4">
                  <div className="flex justify-center mb-2">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.18 7.55 8.87 5.04 12 5.04z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.46-1.11 2.69-2.35 3.52l3.66 2.84c2.14-1.97 3.74-4.87 3.74-8.46z"/>
                      <path fill="#FBBC05" d="M5.26 14.12c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 6.54C.5 8.33 0 10.33 0 12.46s.5 4.13 1.39 5.92l3.87-3.02-3.87 3.02z"/>
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.67-2.3 1.07-4.3 1.07-3.13 0-5.82-2.51-6.74-5.52L1.39 15.8C3.37 19.69 7.35 23 12 23z"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-800">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-400">Choose an account to continue to Young Style</p>

                  <div className="space-y-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleSocialSubmit("Google", "tke30247@gmail.com", "Samin Islam")}
                      className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 flex items-center gap-3 transition-all text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold text-xs">
                        S
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-700">Samin Islam</p>
                        <p className="text-[10px] text-slate-400 font-mono">tke30247@gmail.com</p>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded">Active</span>
                    </button>

                    <div className="border-t border-slate-100 my-2 pt-2">
                      <p className="text-[10px] text-left font-bold text-slate-400 uppercase mb-1">Or Use Another Account</p>
                      <input
                        type="email"
                        placeholder="Enter your Google email"
                        value={customSocialEmail}
                        onChange={(e) => setCustomSocialEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={customSocialName}
                        onChange={(e) => setCustomSocialName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleSocialSubmit("Google", customSocialEmail || "google-user@gmail.com", customSocialName || "Google Guest")}
                        className="w-full mt-2 py-2.5 bg-[#4285F4] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all cursor-pointer"
                      >
                        Continue with Custom Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center mb-2">
                    <svg className="w-10 h-10 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-800">Login with Facebook</h3>
                  <p className="text-[11px] text-slate-400">Log in to your Facebook account to link with Young Style</p>

                  <div className="space-y-2 mt-4">
                    <input
                      type="text"
                      placeholder="Facebook email or phone"
                      value={customSocialEmail}
                      onChange={(e) => setCustomSocialEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={customSocialName}
                      onChange={(e) => setCustomSocialName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleSocialSubmit("Facebook", customSocialEmail || "fb-user@facebook.com", customSocialName || "Facebook User")}
                      className="w-full mt-2 py-3 bg-[#1877F2] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all cursor-pointer"
                    >
                      Log In as {customSocialName || "Facebook User"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl animate-scale-up">
          <div className="text-center mb-6">
            <span className="text-xl font-black text-[#1877F2]">YOUNG STYLE CUSTOMERS</span>
            <p className="text-xs text-slate-400 font-medium mt-1">Access your couture wardrobe details and orders</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
              ⚠️ {authError}
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-[#1877F2] rounded-xl text-xs font-semibold">
              {authSuccess}
            </div>
          )}

          {verificationPending ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                <ShieldCheck className="w-8 h-8 text-[#1877F2] mx-auto animate-bounce" />
                <p className="text-xs font-bold text-slate-700 mt-2">Enter OTP to activate account</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Use code 123456 (Dev sandbox default)</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">6-Digit Activation Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-center font-mono font-bold text-lg focus:ring-0 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? "Validating OTP..." : "Activate & Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Samin Islam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 01712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. info@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {loading 
                  ? "Processing..." 
                  : authMode === "login" ? "Secure Login" : "Initialize Registration"}
              </button>

               <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-xs text-[#1877F2] font-bold hover:underline"
                >
                  {authMode === "login" ? "New here? Create customized profile" : "Already registered? Login"}
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or Connect With</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCustomSocialEmail("tke30247@gmail.com");
                    setCustomSocialName("Google User");
                    setShowSocialModal("Google");
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.18 7.55 8.87 5.04 12 5.04z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.46-1.11 2.69-2.35 3.52l3.66 2.84c2.14-1.97 3.74-4.87 3.74-8.46z"/>
                    <path fill="#FBBC05" d="M5.26 14.12c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 6.54C.5 8.33 0 10.33 0 12.46s.5 4.13 1.39 5.92l3.87-3.02-3.87 3.02z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.67-2.3 1.07-4.3 1.07-3.13 0-5.82-2.51-6.74-5.52L1.39 15.8C3.37 19.69 7.35 23 12 23z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomSocialEmail("tke30247@gmail.com");
                    setCustomSocialName("Facebook User");
                    setShowSocialModal("Facebook");
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Active Dashboard UI
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile Rail menu */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-center space-y-6">
          <div className="space-y-3">
            <img 
              src={user.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} 
              alt={user.name} 
              className="w-20 h-20 rounded-full mx-auto border-2 border-[#1877F2] object-cover bg-slate-50"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-sm font-black text-slate-800">{user.name}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{user.role} Account</p>
            </div>
          </div>

          {/* Quick sidebar tabs */}
          <div className="space-y-1 pt-4 border-t border-slate-100 flex flex-col">
            <button
              onClick={() => { setActiveTab("summary"); setSelectedInvoice(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-colors ${
                activeTab === "summary" ? "bg-blue-50 text-[#1877F2]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <UserIcon className="w-4 h-4" /> Overview Summary
            </button>
            <button
              onClick={() => { setActiveTab("orders"); setSelectedInvoice(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-colors ${
                activeTab === "orders" ? "bg-blue-50 text-[#1877F2]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> My Orders ({orders.length})
            </button>
            <button
              onClick={() => { setActiveTab("wishlist"); setSelectedInvoice(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-colors ${
                activeTab === "wishlist" ? "bg-blue-50 text-[#1877F2]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Heart className="w-4 h-4" /> My Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => { setActiveTab("addresses"); setSelectedInvoice(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-colors ${
                activeTab === "addresses" ? "bg-blue-50 text-[#1877F2]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-4 h-4" /> Address Manager
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSelectedInvoice(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-colors ${
                activeTab === "settings" ? "bg-blue-50 text-[#1877F2]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Settings className="w-4 h-4" /> Account Settings
            </button>
          </div>
        </div>

        {/* Right Side: Tab Workspaces */}
        <div className="lg:col-span-9 space-y-6">

          {selectedInvoice ? (
            /* PRINTABLE INVOICE VIEW */
            <div id="invoice-view" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-6 flex-wrap gap-4">
                <div>
                  <span className="text-xl font-black text-[#1877F2]">YOUNG STYLE</span>
                  <p className="text-[9px] tracking-widest text-slate-400 font-bold uppercase mt-0.5">Premium Clothing Invoice</p>
                </div>
                <div className="text-right">
                  <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase">
                    Order ID: {selectedInvoice.id}
                  </span>
                  <p className="text-xs text-slate-400 mt-1 font-bold">
                    Placed On: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Courier Status</span>
                  <p className="text-sm font-black text-[#1877F2] uppercase mt-0.5">{selectedInvoice.status}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Mode</span>
                  <p className="text-sm font-black text-slate-700 mt-0.5">{selectedInvoice.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</span>
                  <p className="text-sm font-black text-green-600 mt-0.5 capitalize">{selectedInvoice.paymentStatus}</p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100 text-xs font-semibold">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wide">Billed To:</h4>
                  <p className="text-slate-700">{selectedInvoice.customerName}</p>
                  <p className="text-slate-500">{selectedInvoice.phone}</p>
                  <p className="text-slate-500">{selectedInvoice.email}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wide">Shipping Location:</h4>
                  <p className="text-slate-600">
                    {selectedInvoice.address}, {selectedInvoice.area}, {selectedInvoice.district}, {selectedInvoice.division}
                  </p>
                  {selectedInvoice.postalCode && <p className="text-slate-500">Postal Code: {selectedInvoice.postalCode}</p>}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                      <th className="py-3">Item Description</th>
                      <th className="py-3 text-center">Size / Color</th>
                      <th className="py-3 text-right">Qty</th>
                      <th className="py-3 text-right">Unit Price</th>
                      <th className="py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((line, index) => (
                      <tr key={index}>
                        <td className="py-3 flex items-center gap-3">
                          <img src={line.image} alt={line.name} className="w-8 h-10 object-cover rounded-md bg-slate-50" referrerPolicy="no-referrer" />
                          <span className="font-bold text-slate-800">{line.name}</span>
                        </td>
                        <td className="py-3 text-center text-slate-500">
                          {line.selectedSize} / <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: line.selectedColor }} />
                        </td>
                        <td className="py-3 text-right text-slate-500">{line.quantity}</td>
                        <td className="py-3 text-right text-slate-500">৳{line.price}</td>
                        <td className="py-3 text-right text-slate-800 font-bold">৳{line.price * line.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <div className="w-64 space-y-3 text-xs font-semibold">
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping Handling</span>
                    <span>৳{selectedInvoice.shippingCharge}</span>
                  </div>
                  {selectedInvoice.couponDiscount && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>- ৳{selectedInvoice.couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-800 text-sm font-black border-t border-slate-100 pt-3">
                    <span>Grand Total Due</span>
                    <span className="text-[#1877F2]">৳{selectedInvoice.total}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print PDF Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-colors ml-auto"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SUMMARY TAB */}
              {activeTab === "summary" && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                  <div>
                    <h1 className="text-xl font-black text-slate-800">Hello, {user.name}!</h1>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Welcome to your YOUNG Style custom portal. Keep tabs on delivery, print receipts, and handle fitting settings easily.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                    <div className="p-5 bg-blue-50/50 border border-blue-50 rounded-2xl">
                      <span className="text-2xl">📦</span>
                      <p className="text-xs font-bold text-slate-700 mt-3">Total Orders</p>
                      <p className="text-xl font-black text-[#1877F2] mt-1">{orders.length}</p>
                    </div>

                    <div className="p-5 bg-pink-50/50 border border-pink-50 rounded-2xl">
                      <span className="text-2xl">❤️</span>
                      <p className="text-xs font-bold text-slate-700 mt-3">Wishlist items</p>
                      <p className="text-xl font-black text-pink-600 mt-1">{wishlist.length}</p>
                    </div>

                    <div className="p-5 bg-amber-50/50 border border-amber-50 rounded-2xl">
                      <span className="text-2xl">🛡️</span>
                      <p className="text-xs font-bold text-slate-700 mt-3">Saved Addresses</p>
                      <p className="text-xl font-black text-amber-600 mt-1">{user.addressBook.length}</p>
                    </div>
                  </div>

                  {/* Recent tracking row */}
                  {orders.length > 0 && (
                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Order Status</h3>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between flex-wrap gap-4">
                        <div className="text-xs font-semibold">
                          <p className="text-slate-800">Order ID: <span className="font-extrabold">{orders[0].id}</span></p>
                          <p className="text-slate-500 mt-1">Placed On: {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-[#1877F2] font-black uppercase text-[10px] px-3 py-1 rounded-full">
                            {orders[0].status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS HISTORIES TAB */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Purchase Histories</h2>
                  
                  {orders.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <div key={ord.id} className="py-5 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
                          <div className="space-y-1">
                            <p className="text-slate-800 font-extrabold">Order ID: {ord.id}</p>
                            <p className="text-slate-400">Date: {new Date(ord.createdAt).toLocaleDateString()} | Paid via: {ord.paymentMethod}</p>
                            <p className="text-slate-500">Items Count: {ord.items.length}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="bg-[#1877F2]/10 text-[#1877F2] font-extrabold uppercase text-[9px] px-2.5 py-1 rounded-full">
                              {ord.status}
                            </span>
                            <span className="text-[#1877F2] font-black text-sm">৳{ord.total}</span>
                            <button
                              onClick={() => setSelectedInvoice(ord)}
                              className="p-2 bg-slate-100 hover:bg-[#1877F2] text-slate-700 hover:text-white rounded-xl transition-all"
                              title="View Invoice Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No order records saved. Explore our shop and dispatch items!
                    </div>
                  )}
                </div>
              )}

              {/* MY WISHLIST TAB */}
              {activeTab === "wishlist" && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">My Liked Wardrobe</h2>

                  {wishlist.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {products
                        .filter(p => wishlist.includes(p.id))
                        .map((prod) => (
                          <div key={prod.id} className="py-4 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-4">
                              <img src={prod.images[0]} alt={prod.name} className="w-10 h-13 object-cover rounded-md bg-slate-50" referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-extrabold text-slate-800">{prod.name}</p>
                                <p className="text-[#1877F2] font-black text-sm mt-0.5">৳{prod.discountPrice}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onAddToCart(prod, "M", prod.colors[0])}
                                className="px-4 py-2 bg-slate-900 text-white hover:bg-[#1877F2] rounded-xl text-[11px] font-black uppercase transition-all"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => onToggleWishlist(prod.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Your wishlist is empty. Tap the heart icons on our shop cards!
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESS MANAGER TAB */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Address Book Manager</h2>

                  {addressSuccess && (
                    <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-semibold animate-scale-up">
                      {addressSuccess}
                    </div>
                  )}

                  {/* List of existing */}
                  {user.addressBook.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addressBook.map((addr, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold space-y-1 text-slate-600 relative">
                          <span className="absolute top-3 right-3 text-slate-400 text-[10px]">Saved</span>
                          <p className="text-slate-800 font-extrabold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#1877F2]" /> Location {idx + 1}</p>
                          <p className="text-slate-700 mt-1">{addr.address}</p>
                          <p>{addr.area}, {addr.district}</p>
                          <p className="font-bold text-[#1877F2]">{addr.division} Division</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No saved sizing locations. Register one below for fast checkout billing.</p>
                  )}

                  {/* Create Address Form */}
                  <form onSubmit={handleAddAddress} className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Register New Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Division</label>
                        <select
                          value={newAddress.division}
                          onChange={(e) => setNewAddress({ ...newAddress, division: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                        >
                          {["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">District</label>
                        <input
                          type="text"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="e.g. Dhaka"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Area / PS</label>
                        <input
                          type="text"
                          value={newAddress.area}
                          onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="e.g. Mirpur"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Detailed Address</label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="House, Road, Area Details"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="e.g. 1216"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Save Address
                    </button>
                  </form>
                </div>
              )}

              {/* ACCOUNT SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Security & Profile Modification</h2>

                  {authSuccess && (
                    <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-semibold animate-scale-up">
                      {authSuccess}
                    </div>
                  )}

                  {authError && (
                    <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-semibold">
                      ⚠️ {authError}
                    </div>
                  )}

                  <form onSubmit={handleSettingsUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Profile Photo URL</label>
                        <input
                          type="text"
                          value={pfpUrl}
                          onChange={(e) => setPfpUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="HTTPS image address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Current Password *</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">New Password *</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] text-xs font-semibold focus:ring-0 focus:outline-hidden"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3.5 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <KeyRound className="w-4 h-4" />
                      {loading ? "Saving settings..." : "Commit Settings"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
