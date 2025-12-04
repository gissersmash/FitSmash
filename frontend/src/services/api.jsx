import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:4000/api", // 
});

// Ajouter le token JWT automatiquement
export const setToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;
