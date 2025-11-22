// src/components/PrivateRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, refreshing } = useAuth();

    if (refreshing) {
        return <div>Chargement...</div>; // spinner possible
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};
