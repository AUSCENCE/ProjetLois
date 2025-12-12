// Importation de axios
import axios from 'axios';
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
import Projet from '../Types/Projet';

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

export const ajoutProject = async (data: Projet) => {
    try {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('organisme_id', String(data.organisme_id));

        if (data.filePath instanceof File) {
            formData.append('filePath', data.filePath);
        }

        if (data.cloturevoter) {
            formData.append('cloturevoter', data.cloturevoter.toISOString().split('T')[0]);
        }

        const response = await api.post("/projet/store", formData, {
            headers: {
                'Content-Type': undefined,
            }
        });

        console.log("API Response:", response.data);

        return response.data.datas;

    } catch (error) {
        console.error('Erreur lors de l\'ajout du projet:', error);
        throw error;
    }
}


export const getProjects = async () => {
    try {
        const response = await api.get("/projet");
        console.log(response)
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la récupération des organismes:", error);
        throw error;
    }
};

export const getProject = async (id: number) => {
    try {
        const response = await api.get(`/projet/show/${id}`);
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'organisme:", error);
        throw error;
    }
};

export const updateProject = async (id: number, data: Projet) => {
    try {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('organisme_id', String(data.organisme_id));

        if (data.filePath instanceof File) {
            formData.append('filePath', data.filePath);
        }

        if (data.cloturevoter) {
            formData.append('cloturevoter', data.cloturevoter.toISOString().split('T')[0]);
        }

        const response = await api.put(`/projet/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du projet:", error);
        throw error;
    }
}

export const deleteProject = async (id: number) => {
    try {
        const response = await api.delete(`/projet/delete/${id}`);
        return response.data.datas;
    } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
        throw error;
    }
}

export const voteProject = async (id: number, vote: 'VALIDER' | 'REJETER', commentaire?: string) => {
    try {
        const response = await api.post(`/projet/voter/${id}`, {
            vote,
            commentaire
        });
        return response.data.datas;
    } catch (error) {
        console.error('Erreur lors du vote:', error);
        throw error;
    }
}

