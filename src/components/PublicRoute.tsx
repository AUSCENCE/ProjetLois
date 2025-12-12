// src/components/PublicRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./ui/LoadingSpinner";

export const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, refreshing } = useAuth();

    if (refreshing) {
        return <LoadingSpinner />;
    }

    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};
