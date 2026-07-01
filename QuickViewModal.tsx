import React, { useState } from "react";
import { X, Star, ShoppingCart, Zap, Shield, HelpCircle } from "lucide-react";
import { Product } from "../types";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}: QuickViewModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "#000000");
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/80 backdrop-blur-xs">
      <div 
        onClick={onClose} 
        className="fixed inset-0"
      />

      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-scale-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-[#1877F2] text-slate-600 hover:text-white p-2 rounded-full transition-colors z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Slider / Grid */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col gap-4">
          <div className="aspect-3/4 rounded-2xl overflow-hidden bg-white shadow-xs">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail Gallery Row */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 bg-white transition-all ${
                    activeImage === img ? "border-[#1877F2]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Configuration Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category / Brand */}
            <span className="text-xs font-black text-[#1877F2] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              {product.brand} - {product.category}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-4">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={idx < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3.5 mt-4">
              <span className="text-3xl font-black text-[#1877F2]">
                ৳{product.discountPrice}
              </span>
              {product.price > product.discountPrice && (
                <>
                  <span className="text-slate-400 line-through text-sm">
                    ৳{product.price}
                  </span>
                  <span className="bg-green-50 text-green-700 font-extrabold text-xs px-2.5 py-1 rounded-md">
                    Save ৳{product.price - product.discountPrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Colors picker */}
            <div className="mt-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Color:</span>
              <div className="flex items-center gap-2 mt-2">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`w-7 h-7 rounded-full border-2 transition-all block ${
                      selectedColor === col ? "border-[#1877F2] scale-110" : "border-slate-200"
                    }`}
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>
            </div>

            {/* Sizes picker */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Size:</span>
                <span className="text-xs text-[#1877F2] font-semibold hover:underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-10 h-10 px-3 rounded-lg text-xs font-bold border transition-all ${
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

            {/* Stock indicator */}
            <div className="mt-5 text-xs font-semibold">
              {product.stock <= 0 ? (
                <span className="text-red-500 font-bold uppercase tracking-wide">● Sold Out! Request restock.</span>
              ) : product.stock <= 15 ? (
                <span className="text-amber-500 font-bold uppercase tracking-wide">● Hurry, only {product.stock} items available!</span>
              ) : (
                <span className="text-green-600 font-bold">● In Stock (Available immediately)</span>
              )}
            </div>
          </div>

          {/* Cart / Checkout actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 py-4 px-4 btn-primary-gradient text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-transform disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
