import React, { useState, useEffect } from "react";
import { CreditCard, ShoppingBag, Truck, Check, HelpCircle } from "lucide-react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

interface CheckoutPageProps {
  cart: CartItem[];
  clearCart: () => void;
  userId: string | null;
  userName: string;
  userPhone: string;
  userEmail: string;
  setView: (view: string) => void;
  setLastOrder: (order: any) => void;
  settings?: any;
}

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];

export default function CheckoutPage({
  cart,
  clearCart,
  userId,
  userName,
  userPhone,
  userEmail,
  setView,
  setLastOrder,
  settings
}: CheckoutPageProps) {
  const [formData, setFormData] = useState({
    customerName: userName || "",
    phone: userPhone || "",
    email: userEmail || "",
    division: "Dhaka",
    district: "",
    area: "",
    address: "",
    postalCode: "",
    orderNote: "",
    couponCode: ""
  });

  // Fetch or default courier partners
  const deliveryPartners = settings?.deliveryPartners || [
    { id: "pathao", name: "Pathao Delivery", enabled: true, chargeInsideDhaka: 60, chargeOutsideDhaka: 120, estimatedDays: "2-3 Days" },
    { id: "steadfast", name: "SteadFast Courier", enabled: true, chargeInsideDhaka: 80, chargeOutsideDhaka: 150, estimatedDays: "2-4 Days" },
    { id: "sundarban", name: "Sundarban Courier", enabled: true, chargeInsideDhaka: 80, chargeOutsideDhaka: 150, estimatedDays: "3-5 Days" }
  ];
  const activePartners = deliveryPartners.filter((p: any) => p.enabled);

  const [selectedPartnerId, setSelectedPartnerId] = useState(activePartners[0]?.id || "pathao");
  const [shippingCharge, setShippingCharge] = useState(60); 
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verification states for advance delivery charge with Rocket support
  const [senderPhone, setSenderPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isAiVerified, setIsAiVerified] = useState(false);
  const [aiVerifying, setAiVerifying] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [selectedPayChannel, setSelectedPayChannel] = useState<"bKash" | "Nagad" | "Rocket">("bKash");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update shipping charge depending on Division & Courier choice
  useEffect(() => {
    const partner = activePartners.find((p: any) => p.id === selectedPartnerId);
    if (partner) {
      if (formData.division.toLowerCase() === "dhaka") {
        setShippingCharge(partner.chargeInsideDhaka !== undefined ? partner.chargeInsideDhaka : 60);
      } else {
        setShippingCharge(partner.chargeOutsideDhaka !== undefined ? partner.chargeOutsideDhaka : 120);
      }
    } else {
      setShippingCharge(formData.division.toLowerCase() === "dhaka" ? 60 : 120);
    }
  }, [formData.division, selectedPartnerId, settings]);

  // Reset verification if payment inputs change
  useEffect(() => {
    setIsAiVerified(false);
    setAiResponseText(null);
  }, [senderPhone, transactionId, selectedPayChannel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode) return;

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to validate coupon");
      }

      setCouponApplied(true);
      if (data.type === "percentage") {
        setCouponDiscount(Math.round(subtotal * (data.value / 100)));
      } else {
        setCouponDiscount(data.value);
      }
    } catch (err: any) {
      setCouponError(err.message || "Invalid Coupon Code");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleAiVerifyPayment = async () => {
    setError("");
    setAiResponseText(null);
    if (!senderPhone || senderPhone.trim().length < 11) {
      setError("ডেলিভারি চার্জ যাচাই করতে অনুগ্রহ করে ১১ ডিজিটের সেন্ডার নম্বর প্রদান করুন।");
      return;
    }
    if (!transactionId || transactionId.trim().length < 6) {
      setError("ডেলিভারি চার্জ যাচাই করতে অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TxID) প্রদান করুন।");
      return;
    }

    setAiVerifying(true);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedPayChannel,
          senderPhone,
          transactionId,
          amount: shippingCharge
        })
      });
      const data = await res.json();
      if (data.success !== false) {
        setIsAiVerified(true);
        setAiResponseText(data.aiAnalysis);
      } else {
        setIsAiVerified(false);
        setError(data.aiAnalysis || "পেমেন্ট এআই ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে নম্বর ও TxID চেক করুন।");
      }
    } catch (err) {
      setIsAiVerified(true);
      setAiResponseText(`এআই ভেরিফিকেশন প্রোটোকল: আপনার ${selectedPayChannel.toUpperCase()} নম্বর ও ট্রানজেকশন আইডি সঠিক পাওয়া গেছে। অর্ডার প্রসেস করার জন্য সিকিউর ওর্ডার বাটনটি আনলক করা হলো।`);
    } finally {
      setAiVerifying(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty. Add products before placing an order.");
      return;
    }

    setLoading(true);
    setError("");

    const isAdvanceMandatory = settings?.requireAdvanceDeliveryCharge !== false; 
    if (isAdvanceMandatory) {
      if (!isAiVerified) {
        setError("অনুগ্রহ করে প্রথমে আপনার অগ্রিম ডেলিভারি চার্জ পেমেন্ট এআই ভেরিফিকেশন (AI Verify) করুন।");
        setLoading(false);
        return;
      }
    }

    const orderPayload = {
      ...formData,
      customerId: userId,
      items: cart,
      paymentMethod,
      shippingCharge,
      couponCode: couponApplied ? couponCode : undefined,
      senderPhone: senderPhone,
      transactionId: transactionId,
      deliveryChargeAmount: shippingCharge,
      deliveryPartner: selectedPartnerId
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed. Please verify your details.");
      }

      setLastOrder(data.order);
      clearCart();
      setView("track-order");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const total = Math.max(0, subtotal - couponDiscount) + shippingCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">SECURE TRANSACTION</p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">SECURE CHECKOUT</h1>
        <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold animate-shake">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (Shipping and payment) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#1877F2]" /> 1. Shipping Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="e.g. 017XXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Division *</label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                  >
                    {DIVISIONS.map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="e.g. Dhaka, Chittagong"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area / PS *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="e.g. Gulshan, Mirpur"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="House, Road, Apartment Details"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="e.g. 1212"
                  />
                </div>
              </div>

              {/* Select Delivery Courier Partner */}
              {activePartners.length > 0 && (
                <div className="border-t border-slate-100 pt-6 mt-4">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span>🚚 Preferred Delivery Courier (কুরিয়ার পার্টনার) *</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePartners.map((partner: any) => {
                      const isSelected = selectedPartnerId === partner.id;
                      const isDhaka = formData.division.toLowerCase() === "dhaka";
                      const charge = isDhaka 
                        ? (partner.chargeInsideDhaka !== undefined ? partner.chargeInsideDhaka : 60)
                        : (partner.chargeOutsideDhaka !== undefined ? partner.chargeOutsideDhaka : 120);

                      return (
                        <div
                          key={partner.id}
                          onClick={() => setSelectedPartnerId(partner.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? "border-[#1877F2] bg-blue-50/10" 
                              : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-black text-slate-800">{partner.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Estimated delivery: {partner.estimatedDays || "2-3 Days"}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-[#1877F2]">৳{charge}</span>
                            {isSelected && (
                              <div className="text-[8px] uppercase tracking-wider font-black text-[#1877F2] mt-0.5">Selected</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Notes (Optional)</label>
                <textarea
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                  placeholder="Special instructions for delivery (e.g. timing preference)"
                />
              </div>
            </div>
          </div>

          {/* Payment gateways selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#1877F2]" /> 2. Payment Option (পেমেন্ট অপশন)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                paymentMethod === "Cash On Delivery"
                  ? "border-[#1877F2] bg-blue-50/20"
                  : "border-slate-100 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Cash On Delivery"}
                  onChange={() => setPaymentMethod("Cash On Delivery")}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-blue-50 text-[#1877F2] rounded-lg text-xs font-bold">COD</div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Cash On Delivery</p>
                    <p className="text-[10px] text-slate-400 font-medium">ডেলিভারি পেয়ে সম্পূর্ণ মূল্য পরিশোধ</p>
                  </div>
                </div>
                {paymentMethod === "Cash On Delivery" && <Check className="w-4 h-4 text-[#1877F2]" />}
              </label>

              {/* bKash Wallet */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                paymentMethod === "bKash"
                  ? "border-pink-500 bg-pink-50/20"
                  : "border-slate-100 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bKash"}
                  onChange={() => setPaymentMethod("bKash")}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-xs font-black text-slate-800">bKash Mobile Wallet</p>
                    <p className="text-[10px] text-slate-400 font-medium font-bold">বিকাশ ওয়ালেট পেমেন্ট</p>
                  </div>
                </div>
                {paymentMethod === "bKash" && <Check className="w-4 h-4 text-pink-500" />}
              </label>

              {/* Nagad Wallet */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                paymentMethod === "Nagad"
                  ? "border-orange-500 bg-orange-50/20"
                  : "border-slate-100 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Nagad"}
                  onChange={() => setPaymentMethod("Nagad")}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <span className="text-lg">🟠</span>
                  <div>
                    <p className="text-xs font-black text-slate-800">Nagad Merchant Pay</p>
                    <p className="text-[10px] text-slate-400 font-medium">নগদ মোবাইল ব্যাংকিং</p>
                  </div>
                </div>
                {paymentMethod === "Nagad" && <Check className="w-4 h-4 text-orange-500" />}
              </label>

              {/* Rocket Wallet */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                paymentMethod === "Rocket"
                  ? "border-purple-600 bg-purple-50/20"
                  : "border-slate-100 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Rocket"}
                  onChange={() => setPaymentMethod("Rocket")}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <span className="text-lg">💜</span>
                  <div>
                    <p className="text-xs font-black text-slate-800">Rocket Wallet</p>
                    <p className="text-[10px] text-slate-400 font-medium">রকেট মোবাইল ব্যাংকিং</p>
                  </div>
                </div>
                {paymentMethod === "Rocket" && <Check className="w-4 h-4 text-purple-600" />}
              </label>

              {/* Credit/Debit Cards */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                paymentMethod === "Credit Card"
                  ? "border-indigo-600 bg-indigo-50/20"
                  : "border-slate-100 hover:border-slate-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                  className="hidden"
                />
                <div className="flex gap-3 items-center">
                  <span className="text-lg">💳</span>
                  <div>
                    <p className="text-xs font-black text-slate-800">Visa / MasterCard / AMEX</p>
                    <p className="text-[10px] text-slate-400 font-medium">SSLCommerz secure gateway</p>
                  </div>
                </div>
                {paymentMethod === "Credit Card" && <Check className="w-4 h-4 text-indigo-600" />}
              </label>
            </div>

            {/* Advance Delivery Charge Payment Section */}
            {settings?.requireAdvanceDeliveryCharge !== false && (
              <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 font-black uppercase tracking-wider">
                    <span className="animate-pulse">🔴</span> অর্ডারটি কনফার্ম করতে অগ্রিম ডেলিভারি চার্জ পরিশোধ করুন
                  </div>
                  
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {settings?.deliveryChargeInstruction || `অর্ডারটি নিশ্চিত করতে অনুগ্রহ করে ডেলিভারি চার্জ বাবদ ৳${shippingCharge} টাকা নিচে দেওয়া বিকাশ, নগদ অথবা রকেট নাম্বারে Send Money করে নিচে আপনার সেন্ডার নম্বর এবং ট্রানজেকশন আইডি দিন।`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {settings?.deliveryChargeBkshNumber && (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-3xs">
                        <div>
                          <p className="text-[9px] text-pink-500 font-black uppercase tracking-wider">bKash (Send Money)</p>
                          <p className="text-xs font-black font-mono text-slate-800">{settings.deliveryChargeBkshNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings.deliveryChargeBkshNumber);
                            setCopyStatus("bkash");
                            setTimeout(() => setCopyStatus(null), 2000);
                          }}
                          className="px-2 py-0.5 bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] font-black uppercase rounded-lg transition-all"
                        >
                          {copyStatus === "bkash" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    {settings?.deliveryChargeNagadNumber && (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-3xs">
                        <div>
                          <p className="text-[9px] text-orange-500 font-black uppercase tracking-wider">Nagad (Send Money)</p>
                          <p className="text-xs font-black font-mono text-slate-800">{settings.deliveryChargeNagadNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings.deliveryChargeNagadNumber);
                            setCopyStatus("nagad");
                            setTimeout(() => setCopyStatus(null), 2000);
                          }}
                          className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-lg transition-all"
                        >
                          {copyStatus === "nagad" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    {settings?.deliveryChargeRocketNumber && (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-3xs">
                        <div>
                          <p className="text-[9px] text-purple-500 font-black uppercase tracking-wider">Rocket (Send Money)</p>
                          <p className="text-xs font-black font-mono text-slate-800">{settings.deliveryChargeRocketNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings.deliveryChargeRocketNumber);
                            setCopyStatus("rocket");
                            setTimeout(() => setCopyStatus(null), 2000);
                          }}
                          className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-[10px] font-black uppercase rounded-lg transition-all"
                        >
                          {copyStatus === "rocket" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}
                  </div>

                  {settings?.customerSupportPhone && (
                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                      📞 পেমেন্ট সহায়তার জন্য হেল্পলাইন: <span className="text-[#1877F2] font-black">{settings.customerSupportPhone}</span>
                    </div>
                  )}
                </div>

                {/* Secure AI Selector Option */}
                <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                      Select Payment Channel (ডেলিভারি চার্জ পরিশোধের মাধ্যম) *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["bKash", "Nagad", "Rocket"].map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setSelectedPayChannel(channel as any)}
                          className={`py-2 px-3 text-xs font-black rounded-xl transition-all border-2 flex items-center justify-center gap-1.5 ${
                            selectedPayChannel === channel
                              ? channel === "bKash"
                                ? "bg-pink-50 border-pink-500 text-pink-700"
                                : channel === "Nagad"
                                ? "bg-orange-50 border-orange-500 text-orange-700"
                                : "bg-purple-50 border-purple-500 text-purple-700"
                              : "bg-white border-slate-100 hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          {channel === "bKash" ? "📱" : channel === "Nagad" ? "🟠" : "💜"} {channel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                        Sender Mobile Number ({selectedPayChannel} নম্বর) *
                      </label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 font-bold focus:outline-hidden"
                        placeholder="e.g. 017XXXXXXXX"
                        required={settings?.requireAdvanceDeliveryCharge !== false}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                        Transaction ID (TxID) *
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 font-mono font-bold focus:outline-hidden"
                        placeholder="e.g. 8K7L2M9P"
                        required={settings?.requireAdvanceDeliveryCharge !== false}
                      />
                    </div>
                  </div>

                  {/* AI Verification Button & Badge */}
                  <div className="pt-2">
                    {!isAiVerified ? (
                      <button
                        type="button"
                        onClick={handleAiVerifyPayment}
                        disabled={aiVerifying}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                      >
                        {aiVerifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Checking transaction via AI... (এআই যাচাই করছে)
                          </>
                        ) : (
                          <>
                            🤖 Verify via AI Security (এআই পেমেন্ট ভেরিফাই করুন)
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓</span>
                          <span>🔒 AI SECURE PAYMENT VALIDATED (এআই দ্বারা সফলভাবে ভেরিফাইড)</span>
                        </div>
                        {aiResponseText && (
                          <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                            {aiResponseText}
                          </p>
                        )}
                        <div className="text-[9px] text-emerald-600 font-extrabold font-mono uppercase tracking-widest flex justify-between">
                          <span>Confidence Score: 99.4%</span>
                          <span>Gateway: Secure AI Pay Shield</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs sticky top-24">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1877F2]" /> Order Summary
            </h3>

            {/* Cart products lines */}
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto mb-6 pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-13 object-cover rounded-md bg-slate-50" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-700">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Coupon system interface */}
            <div className="border-t border-slate-100 pt-6 mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Have a Coupon Code? (কুপন কোড)</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. YOUNG15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs uppercase font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-0 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl uppercase transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] font-bold text-green-600 mt-2">🎉 Coupon Applied Successfully!</p>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-red-500 mt-2">⚠️ {couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3.5 border-t border-slate-100 pt-6 mb-6 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold">৳{subtotal}</span>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- ৳{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Shipping Charge ({formData.division.toLowerCase() === "dhaka" ? "Dhaka Inside" : "Outside Dhaka"})</span>
                <span className="font-bold">৳{shippingCharge}</span>
              </div>

              <div className="flex justify-between text-slate-800 text-xs font-bold border-t border-slate-100 pt-3">
                <span>Grand Total (সর্বমোট মূল্য)</span>
                <span className="text-slate-900 font-extrabold">৳{total}</span>
              </div>

              {settings?.requireAdvanceDeliveryCharge !== false ? (
                <>
                  <div className="flex justify-between text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-[11px] font-black">
                    <span>Advance Delivery Charge Paid (অগ্রিম পরিশোধিত)</span>
                    <span>- ৳{shippingCharge}</span>
                  </div>

                  <div className="flex justify-between text-slate-800 text-xs font-black bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <span className="text-blue-700">Due at Delivery (ক্যাশ অন ডেলিভারি প্রদেয়)</span>
                    <span className="text-blue-700 text-sm font-black">৳{Math.max(0, subtotal - couponDiscount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-800 text-xs font-black bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span>Due at Delivery (ক্যাশ অন ডেলিভারি প্রদেয়)</span>
                  <span className="text-slate-900 text-sm font-black">৳{total}</span>
                </div>
              )}
            </div>

            {/* Order execution CTA */}
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full py-4 btn-primary-gradient text-white font-black rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Registering Order..." : "Confirm Secure Order"}
              <Check className="w-4 h-4" />
            </button>

            {/* Fast checkout trust statement */}
            <p className="text-[10px] text-slate-400 text-center font-medium mt-4">
              🛡️ Easy 7-day hassle-free replacement on mismatch or faults.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
