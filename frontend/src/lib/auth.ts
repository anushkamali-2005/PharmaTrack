// Authentication context and utilities

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'staff';
}

export interface AuthTokens {
    access_token: string;
    refresh_token?: string;
    token_type: string;
}

const TOKEN_KEY = 'pharmacy_auth_token';
const USER_KEY = 'pharmacy_user';

// Token management
export const authStorage = {
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
    },

    getUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser: (user: User): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    removeUser: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(USER_KEY);
    },

    clear: (): void => {
        authStorage.removeToken();
        authStorage.removeUser();
    },
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!authStorage.getToken();
};

// Decode JWT token (simple version - in production use a library)
export const decodeToken = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};
