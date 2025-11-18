// src/services/statsService.js
const USER_STATS_KEY = 'user_stats';
const USER_RECIPES_KEY = 'user_recipes';
const USER_REVIEWS_KEY = 'user_reviews';

/**
 * Get user stats (resep, favorit, ulasan)
 */
export const getUserStats = () => {
    try {
        // Get favorites count
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        // Get user recipes
        const userRecipes = JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || '[]');

        // Get user reviews
        const userReviews = JSON.parse(localStorage.getItem(USER_REVIEWS_KEY) || '[]');

        return {
            totalRecipes: userRecipes.length,
            totalFavorites: favorites.length,
            totalReviews: userReviews.length
        };
    } catch (err) {
        console.error('Error getting user stats:', err);
        return {
            totalRecipes: 0,
            totalFavorites: 0,
            totalReviews: 0
        };
    }
};

/**
 * Add recipe yang dibuat user
 * @param {Object} recipe - Recipe data dari API
 */
export const addUserRecipe = (recipe) => {
    try {
        const userRecipes = JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || '[]');

        // Add recipe info
        userRecipes.push({
            id: recipe.id,
            name: recipe.name,
            category: recipe.category,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(userRecipes));
        console.log('✅ User recipe added to stats:', recipe.id);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('statsChanged'));

        return true;
    } catch (err) {
        console.error('Error adding user recipe:', err);
        return false;
    }
};

/**
 * Remove recipe dari user stats
 * @param {string} recipeId 
 */
export const removeUserRecipe = (recipeId) => {
    try {
        const userRecipes = JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || '[]');
        const filtered = userRecipes.filter(r => r.id !== recipeId);

        localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(filtered));
        console.log('🗑️ User recipe removed from stats:', recipeId);

        window.dispatchEvent(new CustomEvent('statsChanged'));
        return true;
    } catch (err) {
        console.error('Error removing user recipe:', err);
        return false;
    }
};

/**
 * Get all user recipes
 */
export const getUserRecipes = () => {
    try {
        return JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || '[]');
    } catch (err) {
        console.error('Error getting user recipes:', err);
        return [];
    }
};

/**
 * Add review yang dibuat user
 * @param {Object} review - Review data
 */
export const addUserReview = (review) => {
    try {
        const userReviews = JSON.parse(localStorage.getItem(USER_REVIEWS_KEY) || '[]');

        // Add review info
        userReviews.push({
            id: review.id || `review_${Date.now()}`,
            recipeId: review.recipeId,
            recipeName: review.recipeName || '',
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(userReviews));
        console.log('✅ User review added to stats:', review.id);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('statsChanged'));

        return true;
    } catch (err) {
        console.error('Error adding user review:', err);
        return false;
    }
};

/**
 * Get all user reviews
 */
export const getUserReviews = () => {
    try {
        return JSON.parse(localStorage.getItem(USER_REVIEWS_KEY) || '[]');
    } catch (err) {
        console.error('Error getting user reviews:', err);
        return [];
    }
};

/**
 * Clear all user stats (untuk testing)
 */
export const clearUserStats = () => {
    try {
        localStorage.removeItem(USER_RECIPES_KEY);
        localStorage.removeItem(USER_REVIEWS_KEY);
        window.dispatchEvent(new CustomEvent('statsChanged'));
        console.log('🗑️ User stats cleared');
        return true;
    } catch (err) {
        console.error('Error clearing stats:', err);
        return false;
    }
};

export default {
    getUserStats,
    addUserRecipe,
    removeUserRecipe,
    getUserRecipes,
    addUserReview,
    getUserReviews,
    clearUserStats
};