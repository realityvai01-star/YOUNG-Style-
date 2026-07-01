import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface BannerImage {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
}

interface HeroSliderProps {
  banners: BannerImage[];
  setView: (view: string) => void;
  setFilterCategory: (cat: "all" | "shirt" | "t-shirt") => void;
}

export default function HeroSlider({ banners, setView, setFilterCategory }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // 3 seconds auto slide
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleAction = (link: string) => {
    if (link.includes("category=shirt")) {
      setFilterCategory("shirt");
    } else if (link.includes("category=t-shirt")) {
      setFilterCategory("t-shirt");
    } else {
      setFilterCategory("all");
    }
    setView("shop");
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] bg-slate-950 overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Cover Image */}
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-10000"
            referrerPolicy="no-referrer"
          />

          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 banner-overlay" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#1877F2]/20 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-4 border border-[#1877F2]/30">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span className="text-xs font-black text-blue-100 tracking-wider uppercase">
                    Young & Premium Fashion
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                  {banner.title}
                </h1>
                
                <p className="mt-4 text-sm sm:text-lg text-slate-200 font-medium">
                  {banner.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => handleAction(banner.link)}
                    className="btn-primary-gradient text-white px-8 py-4 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-blue-500/20 uppercase tracking-wider"
                  >
                    Explore Shop
                  </button>
                  <button
                    onClick={() => { setFilterCategory("all"); setView("shop"); }}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all"
                  >
                    View Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Left/Right buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/40 hover:bg-[#1877F2] backdrop-blur-md border border-white/10 hover:border-[#1877F2] text-white p-3 rounded-full transition-all duration-300"
            title="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/40 hover:bg-[#1877F2] backdrop-blur-md border border-white/10 hover:border-[#1877F2] text-white p-3 rounded-full transition-all duration-300"
            title="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-[#1877F2]" : "w-2.5 bg-white/40 hover:bg-white"
              }`}
              title={`Go to Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
