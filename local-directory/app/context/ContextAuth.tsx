'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: 'https://web-production-0fb7e.up.railway.app',
    headers: {
        'Accept': 'application/json',
    }
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export { api };

interface User {
    name: string;
    email: string;
    parish: string;
    country: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('api/user');
                const data = response.data;
                setUser({name: data.name, email: data.email, parish: data.parish, country: data.country});
            } catch (error) {
                localStorage.removeItem('auth_token');
               setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await api.post('api/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};