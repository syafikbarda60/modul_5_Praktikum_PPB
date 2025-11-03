// src/pages/FavoritePage.jsx
import { useState, useEffect } from "react";
import { Heart, Loader, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { useLocalFavorites } from "../hooks/useFavorites";
import recipeService from "../services/recipeService";
import RecipeCard from "../components/common/RecipeCard";

// C:\file kuliah\file praktek\PRAK PBO\modul-lima\modul5\modul-lima\src\components\common\RecipeCard.jsx
// import RecipeCard from "../components/common/RecipeCard";

export default function FavoritePage({ onRecipeClick }) {
  // Gunakan localStorage favorites
  const { favorites, loading: favLoading, refetch } = useLocalFavorites();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log favorites
  useEffect(() => {
    console.log("🔍 Favorites dari localStorage:", favorites);
  }, [favorites]);

  useEffect(() => {
    loadFavoriteRecipes();
  }, [favorites]);

  const loadFavoriteRecipes = async () => {
    console.log("📥 Loading favorite recipes...");
    console.log("📊 Total favorites:", favorites.length);

    if (!favorites || favorites.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch full recipe details for each favorite
      const recipePromises = favorites.map(async (fav) => {
        try {
          console.log("🔄 Fetching recipe:", fav.id);
          const result = await recipeService.getRecipeById(fav.id);
          return result;
        } catch (err) {
          console.error(`❌ Error fetching recipe ${fav.id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(recipePromises);
      console.log("📦 Fetch results:", results);

      const validRecipes = results
        .filter((result) => result && result.success && result.data)
        .map((result) => result.data);

      console.log("✅ Valid recipes:", validRecipes.length);
      setRecipes(validRecipes);
    } catch (err) {
      console.error("❌ Error loading favorite recipes:", err);
      setError("Gagal memuat resep favorit");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllFavorites = () => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus semua resep favorit?")
    ) {
      localStorage.setItem("favorites", JSON.stringify([]));

      // Trigger custom event
      window.dispatchEvent(new CustomEvent("favoritesChanged"));

      refetch();
      setRecipes([]);
    }
  };

  const handleRefresh = () => {
    refetch();
    loadFavoriteRecipes();
  };

  // Debug view
  const showDebugInfo = false; // Set true untuk debugging

  if (favLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Memuat resep favorit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Resep Favorit
                </h1>
                <p className="text-slate-600 mt-1">
                  {recipes.length} resep yang Anda sukai
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>

              {/* Clear All Button */}
              {recipes.length > 0 && (
                <button
                  onClick={handleClearAllFavorites}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Debug Info */}
          {showDebugInfo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-mono">
                <strong>Debug Info:</strong>
                <br />
                Favorites count: {favorites.length}
                <br />
                Recipes loaded: {recipes.length}
                <br />
                Favorites IDs: {favorites.map((f) => f.id).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Belum Ada Resep Favorit
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Mulai tambahkan resep favorit Anda dengan menekan tombol love (❤️)
              pada resep yang Anda suka
            </p>
            <button
              onClick={() => (window.location.href = "#")}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Jelajahi Resep
            </button>
          </div>
        ) : (
          /* Recipe Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onRecipeClick={onRecipeClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
