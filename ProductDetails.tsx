import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Zap, Heart, Share2, Shield, ArrowRight, Check, MessageSquare } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsProps {
  productId: string;
  allProducts: Product[];
  token: string | null;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  setSelectedProductId: (id: string | null) => void;
}

export default function ProductDetails({
  productId,
  allProducts,
  token,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  setSelectedProductId
}: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [copied, setCopied] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data);
        setActiveImage(data.images[0]);
        setSelectedSize(data.sizes[0] || "M");
        setSelectedColor(data.colors[0] || "#000000");
      }
    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-slate-500 font-semibold animate-pulse">
        Loading premium fashion details...
      </div>
    );
  }

  // Related products
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together
  const frequentlyBought = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setReviewError("Please log in to leave a product review.");
      return;
    }
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }
      setReviewSuccess("🎉 Review published successfully!");
      setComment("");
      fetchProductDetails(); // Refetch
    } catch (err: any) {
      setReviewError(err.message || "Something went wrong.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-3/4 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-slate-700 hover:bg-red-500 hover:text-white"
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 bg-slate-50 transition-all ${
                    activeImage === img ? "border-[#1877F2]" : "border-transparent opacity-80"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions Workspace */}
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1877F2] bg-blue-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {product.brand} Collection
              </span>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied!" : "Share Link"}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars summary */}
            <div className="flex items-center gap-2.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={idx < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                {product.rating} Average ({product.reviews.length} Customer Reviews)
              </span>
            </div>

            {/* Pricing Panels */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-4">
              <span className="text-3xl font-black text-[#1877F2]">৳{product.discountPrice}</span>
              {product.price > product.discountPrice && (
                <>
                  <span className="text-slate-400 line-through text-base">৳{product.price}</span>
                  <span className="text-xs font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-md ml-auto">
                    Save ৳{product.price - product.discountPrice} ({Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Material & specification specs */}
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-y border-slate-100 py-6">
              <p><strong className="text-slate-800 font-extrabold">Material Construction:</strong> 100% Cotton, Breathable Double-Ply Weave.</p>
              <p><strong className="text-slate-800 font-extrabold">Specifications:</strong> Non-Iron Tech, Semi-spread high collar, Tailored modern drape.</p>
              <p><strong className="text-slate-800 font-extrabold">Description:</strong> {product.description}</p>
            </div>

            {/* Color selection row */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Color:</span>
              <div className="flex items-center gap-2.5">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform block ${
                      selectedColor === col ? "border-[#1877F2] scale-110" : "border-slate-200"
                    }`}
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>
            </div>

            {/* Size selection row */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Size:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-12 h-12 px-4 rounded-xl text-xs font-black border transition-all ${
                      selectedSize === sz
                        ? "bg-[#1877F2] text-white border-[#1877F2]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock details */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Stock Status (স্টক ও বিক্রয় তথ্য):</span>
              {product.stock <= 0 ? (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide border border-red-150 inline-block">
                  ● Temporarily Out Of Stock (স্টক শেষ)
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl max-w-sm">
                  <div className="text-center bg-white p-2 rounded-xl shadow-3xs border border-slate-50">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Total Pcs</span>
                    <span className="text-xs font-black text-slate-700">
                      {product.stock + Math.max(12, Math.floor((product.rating * 15) + (product.reviews.length * 8) + (product.id.charCodeAt(0) % 25)))}
                    </span>
                  </div>
                  <div className="text-center bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                    <span className="block text-[9px] text-emerald-600 font-bold uppercase">Sold (বিক্রি)</span>
                    <span className="text-xs font-black text-emerald-700">
                      {Math.max(12, Math.floor((product.rating * 15) + (product.reviews.length * 8) + (product.id.charCodeAt(0) % 25)))} Pcs
                    </span>
                  </div>
                  <div className="text-center bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                    <span className="block text-[9px] text-blue-600 font-bold uppercase">Available (আছে)</span>
                    <span className="text-xs font-black text-blue-700">{product.stock} Pcs</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Shopping CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              disabled={product.stock <= 0}
              className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-black flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add To Shopping Cart
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              disabled={product.stock <= 0}
              className="py-4 px-6 btn-primary-gradient text-white rounded-xl text-sm font-black flex items-center justify-center gap-2.5 transition-transform disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" /> Buy Instantly Now
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together section */}
      {frequentlyBought.length > 0 && (
        <div className="mt-16 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">FREQUENTLY BOUGHT TOGETHER</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Combo Display */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Product 1 */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs">
                <img src={product.images[0]} alt={product.name} className="w-10 h-13 object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-xs font-bold text-slate-800 max-w-[150px] truncate">{product.name}</p>
                  <p className="text-[10px] font-black text-[#1877F2]">৳{product.discountPrice}</p>
                </div>
              </div>

              <span className="text-slate-400 font-extrabold text-lg">+</span>

              {/* Product 2 */}
              {frequentlyBought.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs cursor-pointer hover:border-blue-300" onClick={() => setSelectedProductId(item.id)}>
                    <img src={item.images[0]} alt={item.name} className="w-10 h-13 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 max-w-[150px] truncate">{item.name}</p>
                      <p className="text-[10px] font-black text-[#1877F2]">৳{item.discountPrice}</p>
                    </div>
                  </div>
                  {index === 0 && frequentlyBought.length > 1 && <span className="text-slate-400 font-extrabold text-lg">+</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Price block and bundle checkout */}
            <div className="pt-6 md:pt-0 md:pl-8 flex flex-col items-center md:items-start shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bundle Combo Price:</span>
              <span className="text-2xl font-black text-[#1877F2] mt-1">
                ৳{product.discountPrice + frequentlyBought.reduce((sum, item) => sum + item.discountPrice, 0)}
              </span>
              <button
                onClick={() => {
                  onAddToCart(product, selectedSize, selectedColor);
                  frequentlyBought.forEach(b => onAddToCart(b, "M", "#000000"));
                }}
                className="mt-4 px-6 py-3 bg-slate-900 hover:bg-[#1877F2] text-white text-xs font-black rounded-xl uppercase tracking-wider transition-colors"
              >
                Add 3 Items To Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write / View Reviews block */}
      <div className="mt-16 border-t border-slate-100 pt-16">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">CUSTOMER FEEDBACK & VERIFIED REVIEWS</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Submit review */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">LEAVE A REVIEW</h4>

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-semibold animate-scale-up">
                {reviewSuccess}
              </div>
            )}

            {reviewError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-semibold">
                ⚠️ {reviewError}
              </div>
            )}

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating Star Score *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl focus:outline-hidden transition-transform hover:scale-115 ${
                        rating >= star ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comment Detail *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share details of your experience with the fabric texture, stitching quality, and sizing fit..."
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-0 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-3.5 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest transition-opacity disabled:opacity-50"
              >
                {reviewLoading ? "Posting review..." : "Publish Review"}
              </button>
            </form>
          </div>

          {/* Right Side: Reviews feed list */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">REVIEWS LIST</h4>
            {product.reviews.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="py-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-extrabold text-slate-800">{rev.userName}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>{idx < rev.rating ? "★" : "☆"}</span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                No verified purchase reviews recorded for this product yet. Be the first to add your review!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
