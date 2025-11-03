// src/hooks/useQueryCache.js
import { useState, useEffect, useCallback } from 'react';

// Cache storage
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for query caching
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 * @param {Object} options - Options { enabled, cacheTime, staleTime }
 */
export function useQueryCache(key, fetchFn, options = {}) {
    const {
        enabled = true,
        cacheTime = CACHE_DURATION,
        staleTime = 0,
        refetchOnMount = true
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    // Get cached data
    const getCachedData = useCallback(() => {
        const cached = cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > cacheTime;

        if (isExpired) {
            cache.delete(key);
            return null;
        }

        return cached;
    }, [key, cacheTime]);

    // Check if data is stale
    const isStale = useCallback(() => {
        const cached = cache.get(key);
        if (!cached) return true;

        const now = Date.now();
        return now - cached.timestamp > staleTime;
    }, [key, staleTime]);

    // Fetch data
    const fetchData = useCallback(async (showLoading = true) => {
        if (!enabled) return;

        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setIsFetching(true);
            }
            setError(null);

            const result = await fetchFn();

            // Cache the data
            cache.set(key, {
                data: result,
                timestamp: Date.now()
            });

            setData(result);
        } catch (err) {
            console.error(`Error fetching data for key: ${key}`, err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [key, fetchFn, enabled]);

    // Refetch data
    const refetch = useCallback(() => {
        return fetchData(false);
    }, [fetchData]);

    // Invalidate cache
    const invalidate = useCallback(() => {
        cache.delete(key);
        return fetchData(true);
    }, [key, fetchData]);

    // Load data on mount
    useEffect(() => {
        if (!enabled) return;

        const cached = getCachedData();

        if (cached && !isStale()) {
            // Use cached data
            setData(cached.data);
            setLoading(false);

            // Optionally refetch in background if stale
            if (refetchOnMount && isStale()) {
                fetchData(false);
            }
        } else {
            // Fetch fresh data
            fetchData(true);
        }
    }, [key, enabled]);

    return {
        data,
        loading,
        error,
        isFetching,
        refetch,
        invalidate
    };
}

/**
 * Invalidate cache by key pattern
 * @param {string|RegExp} pattern - Key pattern to match
 */
export function invalidateCacheByPattern(pattern) {
    const keys = Array.from(cache.keys());

    keys.forEach(key => {
        if (typeof pattern === 'string' && key.includes(pattern)) {
            cache.delete(key);
        } else if (pattern instanceof RegExp && pattern.test(key)) {
            cache.delete(key);
        }
    });
}

/**
 * Clear all cache
 */
export function clearAllCache() {
    cache.clear();
}

/**
 * Get cache size
 */
export function getCacheSize() {
    return cache.size;
}

/**
 * Prefetch data and store in cache
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 */
export async function prefetchQuery(key, fetchFn) {
    try {
        const result = await fetchFn();
        cache.set(key, {
            data: result,
            timestamp: Date.now()
        });
        return result;
    } catch (err) {
        console.error(`Error prefetching data for key: ${key}`, err);
        throw err;
    }
}

export default useQueryCache;