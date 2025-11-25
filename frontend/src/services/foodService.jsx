// frontend/src/services/foodService.js
import API from "./api";

// Utiliser les routes relatives à baseURL (baseURL contient déjà "/api")
export const getFoods = () => API.get("/foods");
export const addFood = (data) => API.post("/foods", data);
export const updateFood = (id, data) => API.put(`/foods/${id}`, data);
export const deleteFood = (id) => API.delete(`/foods/${id}`);
export const searchFoods = (mot) => API.get(`/foods?search=${encodeURIComponent(mot)}`);
