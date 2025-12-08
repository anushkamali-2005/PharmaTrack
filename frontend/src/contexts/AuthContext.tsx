'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage, User, isTokenExpired } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const token = authStorage.getToken();
        const savedUser = authStorage.getUser();

        if (token && savedUser && !isTokenExpired(token)) {
            setUser(savedUser);
        } else {
            authStorage.clear();
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });
            // const data = await response.json();

            // Simulated login for now
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: 1,
                email,
                name: email.split('@')[0],
                role: 'admin',
            };

            const mockToken = 'mock_jwt_token_' + Date.now();

            authStorage.setToken(mockToken);
            authStorage.setUser(mockUser);
            setUser(mockUser);

            router.push('/dashboard');
        } catch (error) {
            throw new Error('Login failed. Please check your credentials.');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('http://localhost:8000/api/v1/auth/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name, email, password }),
            // });
            // const data = await response.json();

            // Simulated registration
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: Date.now(),
                email,
                name,
                role: 'staff',
            };

            const mockToken = 'mock_jwt_token_' + Date.now();

            authStorage.setToken(mockToken);
            authStorage.setUser(mockUser);
            setUser(mockUser);

            router.push('/dashboard');
        } catch (error) {
            throw new Error('Registration failed. Please try again.');
        }
    };

    const logout = () => {
        authStorage.clear();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
