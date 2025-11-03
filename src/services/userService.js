// const USER_PROFILE_KEY = 'user_profile';
// const USER_IDENTIFIER_KEY = 'user_identifier';
// /**
//  * Get or generate user identifier
//  */
// export const getUserIdentifier = () => {
//     let userId = localStorage.getItem(USER_IDENTIFIER_KEY);
//     if (!userId) {
//         userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//         localStorage.setItem(USER_IDENTIFIER_KEY, userId);
//     }
//     return userId;
// };

// /**
//  * Get user profile from localStorage
//  */
// export const getUserProfile = () => {
//     try {
//         const profile = localStorage.getItem(USER_PROFILE_KEY);
//         if (profile) {
//             return JSON.parse(profile);
//         }

//         // Return default profile with user identifier
//         return {
//             username: 'Pengguna',
//             avatar: null,
//             bio: '',
//             userId: getUserIdentifier()
//         };
//     } catch (error) {
//         return {
//             username: 'Pengguna',
//             avatar: null,
//             bio: '',
//             userId: getUserIdentifier()
//         };
//     }
// };

// /**
//  * Save user profile to localStorage
//  */
// export const saveUserProfile = (profile) => {
//     try {
//         const userId = getUserIdentifier();
//         const profileData = {
//             ...profile,
//             userId,
//             updatedAt: new Date().toISOString()
//         };
//         localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
//         return { success: true, data: profileData };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

// /**
//  * Update user avatar
//  */
// export const updateAvatar = (avatarBase64) => {
//     try {
//         const profile = getUserProfile();
//         profile.avatar = avatarBase64;
//         return saveUserProfile(profile);
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

// /**
//  * Update username
//  */
// export const updateUsername = (username) => {
//     try {
//         const profile = getUserProfile();
//         profile.username = username.trim() || 'Pengguna';
//         return saveUserProfile(profile);
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

// /**
//  * Update bio
//  */
// export const updateBio = (bio) => {
//     try {
//         const profile = getUserProfile();
//         profile.bio = bio.trim();
//         return saveUserProfile(profile);
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

// export default {
//     getUserIdentifier,
//     getUserProfile,
//     saveUserProfile,
//     updateAvatar,
//     updateUsername,
//     updateBio
// };
// src/services/userService.js
const USER_PROFILE_KEY = 'user_profile';
const USER_IDENTIFIER_KEY = 'user_identifier';

/**
 * Get or generate user identifier
 */
export const getUserIdentifier = () => {
    let userId = localStorage.getItem(USER_IDENTIFIER_KEY);
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(USER_IDENTIFIER_KEY, userId);
    }
    return userId;
};

/**
 * Get user profile from localStorage
 */
export const getUserProfile = () => {
    try {
        const profile = localStorage.getItem(USER_PROFILE_KEY);
        if (profile) {
            return JSON.parse(profile);
        }
        // Return default profile with user identifier
        return {
            username: 'Pengguna',
            email: '',
            phone: '',
            location: '',
            avatar: null,
            bio: '',
            userId: getUserIdentifier(),
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        return {
            username: 'Pengguna',
            email: '',
            phone: '',
            location: '',
            avatar: null,
            bio: '',
            userId: getUserIdentifier(),
            createdAt: new Date().toISOString()
        };
    }
};

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile) => {
    try {
        const userId = getUserIdentifier();
        const currentProfile = getUserProfile();

        const profileData = {
            ...currentProfile,
            ...profile,
            userId,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
        return { success: true, data: profileData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update user avatar
 */
export const updateAvatar = (avatarBase64) => {
    try {
        const profile = getUserProfile();
        profile.avatar = avatarBase64;
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update username
 */
export const updateUsername = (username) => {
    try {
        const profile = getUserProfile();
        profile.username = username.trim() || 'Pengguna';
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update email
 */
export const updateEmail = (email) => {
    try {
        const profile = getUserProfile();
        profile.email = email.trim();
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update phone
 */
export const updatePhone = (phone) => {
    try {
        const profile = getUserProfile();
        profile.phone = phone.trim();
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update location
 */
export const updateLocation = (location) => {
    try {
        const profile = getUserProfile();
        profile.location = location.trim();
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Update bio
 */
export const updateBio = (bio) => {
    try {
        const profile = getUserProfile();
        profile.bio = bio.trim();
        return saveUserProfile(profile);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Clear user profile
 */
export const clearUserProfile = () => {
    try {
        localStorage.removeItem(USER_PROFILE_KEY);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default {
    getUserIdentifier,
    getUserProfile,
    saveUserProfile,
    updateAvatar,
    updateUsername,
    updateEmail,
    updatePhone,
    updateLocation,
    updateBio,
    clearUserProfile
};