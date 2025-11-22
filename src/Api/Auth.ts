//auth.ts
import axios from "axios";
import User from "../Types/User";

// --- CONFIGURATION BACKEND ---
const API_URL = "http://localhost:8000";

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
    console.error("Erreur lors de l'initialisation du cookie CSRF :", error.response?.data?.message || error.message);
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
  const response = await api.post("/user/register", {
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
  const response = await api.get("/api/user/me");
  return response.data.datas.user;
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

