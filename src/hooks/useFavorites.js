// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import userService from '../services/userService';

/**
 * Get user identifier from localStorage or generate new one
 */
const getUserIdentifier = () => {
    return userService.getUserIdentifier();
};

/**
 * Custom hook for fetching favorites from API
 * @returns {Object} - { favorites, loading, error, refetch }
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userIdentifier = getUserIdentifier();

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await favoriteService.getFavorites(userIdentifier);

            if (response.success) {
                setFavorites(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch favorites');
            }
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError(err.message || 'An error occurred while fetching favorites');
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, [userIdentifier]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return {
        favorites,
        loading,
        error,
        refetch: fetchFavorites,
    };
}

/**
 * Custom hook for fetching favorites from localStorage
 * Use this as fallback or for offline mode
 * @returns {Object} - { favorites, loading, error, refetch }
 */
export function useLocalFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = useCallback(() => {
        try {
            setLoading(true);
            const storedFavorites = localStorage.getItem('favorites');

            if (storedFavorites) {
                const parsedFavorites = JSON.parse(storedFavorites);

                // Jika array of strings (recipe IDs), convert ke array of objects
                if (Array.isArray(parsedFavorites)) {
                    if (parsedFavorites.length > 0 && typeof parsedFavorites[0] === 'string') {
                        // Convert array of IDs to array of objects
                        const formattedFavorites = parsedFavorites.map(id => ({ id }));
                        setFavorites(formattedFavorites);
                    } else {
                        setFavorites(parsedFavorites);
                    }
                } else {
                    setFavorites([]);
                }
            } else {
                setFavorites([]);
            }
        } catch (err) {
            console.error('Error loading favorites from localStorage:', err);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();

        // Listen for storage changes
        const handleStorageChange = (e) => {
            if (e.key === 'favorites') {
                loadFavorites();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for same-tab updates
        window.addEventListener('favoritesChanged', loadFavorites);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesChanged', loadFavorites);
        };
    }, [loadFavorites]);

    return {
        favorites,
        loading,
        error: null,
        refetch: loadFavorites,
    };
}

/**
 * Custom hook for toggling favorites
 * @returns {Object} - { toggleFavorite, loading, error }
 */
export function useToggleFavorite() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userIdentifier = getUserIdentifier();

    const toggleFavorite = async (recipeId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await favoriteService.toggleFavorite({
                recipe_id: recipeId,
                user_identifier: userIdentifier,
            });

            if (response.success) {
                // Dispatch custom event for local updates
                window.dispatchEvent(new CustomEvent('favoritesChanged'));
                return response.data;
            } else {
                setError(response.message || 'Failed to toggle favorite');
                return null;
            }
        } catch (err) {
            setError(err.message || 'An error occurred while toggling favorite');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        toggleFavorite,
        loading,
        error,
    };
}

/**
 * Custom hook to check if a recipe is favorited
 * @param {string} recipeId - Recipe ID
 * @returns {Object} - { isFavorited, loading, toggleFavorite }
 */
export function useIsFavorited(recipeId) {
    const { favorites, loading: fetchLoading, refetch } = useLocalFavorites();
    const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite();

    const isFavorited = favorites.some(fav => fav.id === recipeId);

    const toggleFavorite = async () => {
        const result = await toggle(recipeId);
        if (result) {
            await refetch();
        }
        return result;
    };

    return {
        isFavorited,
        loading: fetchLoading || toggleLoading,
        toggleFavorite,
    };
}

export { getUserIdentifier };