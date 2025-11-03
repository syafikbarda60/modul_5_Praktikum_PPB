// src/components/common/LazyImage.jsx
import { useState, useEffect, useRef } from "react";

/**
 * LazyImage Component - Lazy loading gambar dengan Intersection Observer
 * @param {string} src - URL gambar
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @param {string} placeholderColor - Warna placeholder (default: slate-200)
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  placeholderColor = "bg-slate-200",
  onLoad,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: load image immediately if not supported
      setIsInView(true);
      return;
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Stop observing once in view
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    // Start observing
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual Image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className={`
            w-full h-full object-cover transition-opacity duration-500
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        />
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
