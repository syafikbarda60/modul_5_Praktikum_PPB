// src/components/common/RecipeCard.jsx
import { useState, useEffect, useRef } from "react";
import { Clock, Star, ChefHat } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import LazyImage from "./LazyImage";

/**
 * RecipeCard Component - SCROLL AWARE
 * ------------------------------------
 * Card tetap muncul normal, tapi gambar hanya load saat scroll
 */
export default function RecipeCard({ recipe, onRecipeClick, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Card animation tetap normal
            const delay = (index % 6) * 60;

            setTimeout(() => {
              setIsVisible(true);
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px", // ⭐ No buffer untuk card
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [index]);

  const getCategoryColor = (category) => {
    return category === "makanan"
      ? "text-blue-700 bg-blue-100"
      : "text-green-700 bg-green-100";
  };

  return (
    <div
      ref={cardRef}
      className={`group transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        onClick={() =>
          onRecipeClick && onRecipeClick(recipe.id, recipe.category)
        }
        className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
      >
        {/* Efek cahaya halus di hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* ================= IMAGE SECTION ================= */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-slate-200">
          <LazyImage
            src={recipe.image_url}
            alt={recipe.name}
            index={index}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
            placeholderColor="bg-gradient-to-br from-slate-200 to-slate-300"
          />

          {/* Gradasi gelap di bawah gambar */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton recipeId={recipe.id} size="sm" />
          </div>
        </div>

        {/* ================= CARD CONTENT ================= */}
        <div className="relative z-10 p-4 md:p-6">
          {/* Kategori & Rating */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(
                recipe.category
              )}`}
            >
              {recipe.category === "makanan" ? "Makanan" : "Minuman"}
            </span>

            {recipe.average_rating > 0 && (
              <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-slate-700">
                  {recipe.average_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Judul resep */}
          <h3 className="font-bold text-slate-800 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {recipe.name}
          </h3>

          {/* Deskripsi singkat */}
          {recipe.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Informasi waktu & tingkat kesulitan */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{recipe.prep_time} menit</span>
            </div>

            <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
              <ChefHat className="w-4 h-4" />
              <span className="font-medium capitalize">
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
