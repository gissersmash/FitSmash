import api from "./api";

// Récupère tous les aliments suivis (entrées utilisateur)
export const getFoodEntries = () => api.get("/foods");
// Ajoute une entrée alimentaire
export const addFoodEntry = (data) => api.post("/foods", data);
// Supprime une entrée alimentaire
export const deleteFood = (id) => api.delete(`/foods/${id}`);

// Récupère la liste des aliments génériques (si besoin)
export const getFoods = () => api.get("/api/foods");
// Ajoute un aliment générique (si besoin)
export const addFood = (data) => api.post("/foods", data);
