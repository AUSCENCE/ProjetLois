// user.ts
import axios from "axios";
import User from "../Types/User";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
});

// Inject token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Fetch all users
 */
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get("/api/user");
        // Supporting different response formats
        ;
        return response.data.datas.data;
    } catch (error) {
        console.error("fetchUsers error:", error);
        throw error;
    }
};

/**
 * Update a user's role
 */
export const updateUserRole = async (userId: number, role: string): Promise<User> => {
    try {
        const response = await api.put(`/api/user/${userId}/role`, { role });
        if (response.data.datas) {
            return response.data.datas;
        }
        return response.data;
    } catch (error) {
        console.error("updateUserRole error:", error);
        throw error;
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: number): Promise<void> => {
    try {
        await api.delete(`/api/user/${userId}`);
    } catch (error) {
        console.error("deleteUser error:", error);
        throw error;
    }
};

/**
 * Create a new user
 */
export const createUser = async (userData: Partial<User>): Promise<{ user: User, password?: string }> => {
    try {
        const response = await api.post("/api/user", userData);
        if (response.data.datas) {
            return response.data.datas;
        }
        return response.data.datas;
    } catch (error) {
        console.error("createUser error:", error);
        throw error;
    }
};
