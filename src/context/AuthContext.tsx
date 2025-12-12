// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Auth from "../Api/Auth";


import User from "../Types/User";
type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshing: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [refreshing, setRefreshing] = useState(true);

    // Load current user on mount
    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setRefreshing(false);
                return;
            }

            try {
                await Auth.getCsrfCookie();
                const user = await Auth.fetchUser();
                setUser(user);
            } catch (err) {
                console.error("Erreur lors de la récupération de l'utilisateur:", err);
                // Si le token est invalide, le supprimer pour éviter les boucles
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setRefreshing(false);
            }
        };
        bootstrap();
    }, []);

    const login = async (email: string, password: string) => {
        const user = await Auth.login(email, password);
        setUser(user);

    };

    const register = async (name: string, email: string, password: string) => {
        const user = await Auth.register(name, email, password);
        setUser(user);
    };

    const logout = async () => {
        await Auth.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
