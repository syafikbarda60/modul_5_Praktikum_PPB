// src/hooks/useRecipesWithFilters.js
import { useState, useEffect, useCallback } from 'react';
import recipeService from '../services/recipeService';

/**
 * Custom hook untuk GET resep dengan filtering advanced
 * 
 * Contoh endpoint: https://modlima.fuadfakhruz.id/api/v1/recipes
 * 
 * Query Parameters:
 * - category: 'makanan' | 'minuman'
 * - difficulty: 'mudah' | 'sedang' | 'sulit'
 * - sort_by: 'oldest' | 'newest' | 'name' | dll
 * 
 * @param {Object} filters - Filter parameters
 * @returns {Object} - { recipes, loading, error, pagination, refetch }
 */
export function useRecipesWithFilters(filters = {}) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    // Build query params
    const buildParams = useCallback(() => {
        const params = {};

        // Category filter (makanan/minuman)
        if (filters.category) {
            params.category = filters.category;
        }

        // Difficulty filter (mudah/sedang/sulit)
        if (filters.difficulty) {
            params.difficulty = filters.difficulty;
        }

        // Sort by (oldest/newest)
        if (filters.sortBy) {
            // Map 'oldest' to 'created_at' dengan order 'asc'
            // Map 'newest' to 'created_at' dengan order 'desc'
            if (filters.sortBy === 'oldest') {
                params.sort_by = 'created_at';
                params.order = 'asc';
            } else if (filters.sortBy === 'newest') {
                params.sort_by = 'created_at';
                params.order = 'desc';
            } else {
                // Custom sort_by
                params.sort_by = filters.sortBy;
                params.order = filters.order || 'asc';
            }
        }

        // Pagination
        if (filters.page) {
            params.page = filters.page;
        }

        if (filters.limit) {
            params.limit = filters.limit;
        }

        // Search
        if (filters.search) {
            params.search = filters.search;
        }

        return params;
    }, [filters]);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = buildParams();
            console.log('🔍 Fetching recipes with params:', params);

            const response = await recipeService.getRecipes(params);

            if (response.success) {
                setRecipes(response.data || []);
                setPagination(response.pagination || null);
                console.log('✅ Recipes fetched:', response.data.length);
            } else {
                setError(response.message || 'Failed to fetch recipes');
            }
        } catch (err) {
            console.error('❌ Error fetching recipes:', err);
            setError(err.message || 'An error occurred while fetching recipes');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return {
        recipes,
        loading,
        error,
        pagination,
        refetch: fetchRecipes,
    };
}

/**
 * Hook untuk filter berdasarkan kategori saja
 */
export function useRecipesByCategory(category, options = {}) {
    return useRecipesWithFilters({
        category,
        ...options
    });
}

/**
 * Hook untuk filter berdasarkan difficulty
 */
export function useRecipesByDifficulty(difficulty, options = {}) {
    return useRecipesWithFilters({
        difficulty,
        ...options
    });
}

/**
 * Hook untuk sorting (oldest/newest)
 */
export function useRecipesSorted(sortBy = 'newest', options = {}) {
    return useRecipesWithFilters({
        sortBy,
        ...options
    });
}

export default useRecipesWithFilters;