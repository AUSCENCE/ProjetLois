//auth.ts
import axios from "axios";
import User from "../Types/User";

// --- CONFIGURATION BACKEND ---
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
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



// Fonction pour initialiser le cookie CSRF
export const getCsrfCookie = async () => {
  try {
    console.log('OK');
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    const err = error as any;
    console.error("Erreur lors de l'initialisation du cookie CSRF :", err.response?.data?.message || err.message);
    throw error;
  }
};

/* =======================================================
 * 1. REGISTER
 * ======================================================= */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await api.post("/api/user/register", {
    name,
    email,
    password,
  });

  const token = response.data.token;
  localStorage.setItem("token", token);

  return response.data.datas.user;
};

/* =======================================================
 * 2. LOGIN
 * ======================================================= */
export const login = async (
  email: string,
  password: string
): Promise<User> => {

  await getCsrfCookie()
  const response = await api.post("/api/user/login", {
    email,
    password,
  });
  console.log(response);
  const token = response.data.datas.token;
  localStorage.setItem("token", token);
  return response.data.datas.user;
};

/* =======================================================
 * 3. GET AUTHENTICATED USER
 * ======================================================= */
export const fetchUser = async (): Promise<User> => {
  try {
    const response = await api.get("/api/user/me");
    console.log("fetchUser response:", response.data);
    // Check if the structure matches expectation
    if (response.data.datas && response.data.datas.user) {
      return response.data.datas.user;
    } else if (response.data.user) {
      return response.data.user;
    } else {
      // Fallback or assume response.data is the user if it has an id
      return response.data;
    }
  } catch (error) {
    console.error("fetchUser error:", error);
    throw error;
  }
};

/* =======================================================
 * 4. LOGOUT
 * ======================================================= */
export const logout = async (): Promise<void> => {
  await api.post("/api/user/logout");
  localStorage.removeItem("token");
};

/* =======================================================
 * 5. REFRESH TOKEN (OPTIONNEL)
 * ======================================================= */
export const refreshToken = async (): Promise<string> => {
  const response = await api.post("/api/token/refresh");

  const token = response.data.token;
  localStorage.setItem("token", token);

  return token;
};

