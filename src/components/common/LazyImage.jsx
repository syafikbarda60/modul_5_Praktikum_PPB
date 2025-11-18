// src/components/common/LazyImage.jsx
import { useState, useEffect, useRef } from "react";

export default function LazyImage({ src, alt = "", className = "", onLoad }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            console.log("👁️ Image entering viewport:", src);
            setIsInView(true);

            setTimeout(() => {
              setShouldLoad(true);
            }, 100);

            if (observerRef.current && entry.target) {
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // Mulai observe
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    console.log("✅ Image loaded:", src);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    console.error("❌ Failed to load image:", src);
    setIsLoaded(true); // Set loaded untuk remove skeleton
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-slate-200 ${className}`}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      )}

      {/* Loading Spinner (saat sedang load) */}
      {shouldLoad && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-sm">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-r-blue-400 rounded-full animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Actual Image - hanya render jika shouldLoad true */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            w-full h-full object-cover
            transition-opacity duration-700 ease-out
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
          loading="lazy"
        />
      )}

      {/* Debug indicator (hapus di production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-2 left-2 text-xs">
          {!isInView && (
            <span className="bg-red-500 text-white px-2 py-1 rounded">
              Waiting
            </span>
          )}
          {isInView && !shouldLoad && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded">
              In View
            </span>
          )}
          {shouldLoad && !isLoaded && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded">
              Loading...
            </span>
          )}
          {isLoaded && (
            <span className="bg-green-500 text-white px-2 py-1 rounded">
              Loaded
            </span>
          )}
        </div>
      )}
    </div>
  );
}
