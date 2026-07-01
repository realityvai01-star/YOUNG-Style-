import React from "react";
import { Heart, Eye, ArrowLeftRight, ShoppingCart, Zap, Star } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onBuyNow: (product: Product, size?: string, color?: string) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  setSelectedProductId: (id: string | null) => void;
  setView: (view: string) => void;
  key?: string | number;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  setSelectedProductId,
  setView
}: ProductCardProps) {
  // Use first size and color as default if client adds straight from card
  const defaultSize = product.sizes[0] || "M";
  const defaultColor = product.colors[0] || "#000000";

  const handleProductClick = () => {
    setSelectedProductId(product.id);
    setView("product-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Top badges & Image Container */}
      <div className="relative aspect-3/4 w-full bg-slate-50 overflow-hidden cursor-pointer" onClick={handleProductClick}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.flashSale && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" /> Flash Sale
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#1877F2] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              New
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Best Seller
            </span>
          )}
        </div>

        {/* Hover quick-actions panel */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            title="Add to Wishlist"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white/90 text-slate-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            title="Quick View"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:bg-[#1877F2] hover:text-white shadow-md transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            title="Compare Product"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
              isCompared 
                ? "bg-blue-600 text-white" 
                : "bg-white/90 text-slate-700 hover:bg-blue-600 hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stock status overlay if low or empty */}
        {product.stock <= 0 ? (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-950 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        ) : product.stock <= 15 ? (
          <span className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
            Only {product.stock} Left!
          </span>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand & Stars */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
          </div>
        </div>

        {/* Name */}
        <h3 
          onClick={handleProductClick}
          className="text-sm font-bold text-slate-800 hover:text-[#1877F2] transition-colors cursor-pointer line-clamp-2 min-h-[40px] mb-2"
        >
          {product.name}
        </h3>

        {/* Available Colors & Sizes (Compact) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((col) => (
              <span
                key={col}
                className="w-3 h-3 rounded-full border border-slate-200 shadow-2xs block"
                style={{ backgroundColor: col }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] font-bold text-slate-400">+{product.colors.length - 3}</span>
            )}
          </div>
          <span className="text-slate-200 text-xs">|</span>
          <div className="flex items-center gap-1 flex-wrap">
            {product.sizes.map((sz) => (
              <span key={sz} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded-sm">
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Price Tag */}
        <div className="mt-auto mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#1877F2]">
              ৳{product.discountPrice}
            </span>
            {product.price > product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.price}
              </span>
            )}
          </div>
          {product.price > product.discountPrice && (
            <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(product, defaultSize, defaultColor)}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-300 ${
              product.stock <= 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            + Cart
          </button>

          <button
            onClick={() => onBuyNow(product, defaultSize, defaultColor)}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-300 btn-primary-gradient text-white ${
              product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
