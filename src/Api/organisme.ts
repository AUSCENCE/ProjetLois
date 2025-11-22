// Importation de axios
import axios from 'axios';
import Organisme from '../Types/Organisme';
//import Swal from 'sweetalert2';

// URL de base pour les API
const API_URL = 'http://localhost:8000/api';

// Variable pour éviter plusieurs alertes simultanées
let isSessionExpired = false;

// Créer une instance axios avec intercepteur pour ajouter le token
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Permet d'envoyer et recevoir les cookies (session et CSRF)
    withXSRFToken: true, // Permet d'envoyer et recevoir
});

// Injecter automatiquement le token dans Axios si présent
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


import { refreshToken } from './Auth';

// Supprime toute propriété non standard (ex: withXSRFToken)
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Session expirée ou utilisateur non authentifié.", refreshError);
                // Gérer la déconnexion ici si nécessaire (ex: redirection vers login)
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const ajoutOrganisme = async (data: Organisme) => {
    try {

        const response = await api.post("/organisme/store", data)
        console.log(response.data.datas)

        return response.data.datas

    } catch (error) {
        console.error(error);
    }

}

export const getOrganismes = async () => {
    try {
        const response = await api.get("/organisme");
        console.log(response.data.datas)

        return response.data.datas;

    } catch (error) {
        console.error("Erreur lors de la récupération des organismes:", error);
        throw error;
    }
};

export const getOrganisme = async (id: number) => {
    try {
        const response = await api.get(`/organisme/${id}`);
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'organisme:", error);
        throw error;
    }
};

export const updateOrganisme = async (id: number, data: Organisme) => {
    try {
        const response = await api.put(`/organisme/store/${id}`, data);
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'organisme:", error);
        throw error;
    }
};

export const deleteOrganisme = async (id: number) => {
    try {
        const response = await api.delete(`/organisme/${id}`);
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'organisme:", error);
        throw error;
    }
};
