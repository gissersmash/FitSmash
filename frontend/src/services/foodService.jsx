// frontend/src/services/foodService.js
import API from "./api";

// Utiliser les routes relatives à baseURL (baseURL contient déjà "/api")
export const getFoods = () => API.get("/foods");
export const addFood = (data) => API.post("/foods", data);
export const updateFood = (id, data) => API.put(`/foods/${id}`, data);
export const deleteFood = (id) => API.delete(`/foods/${id}`);

// Recherche dans la base de données locale
export const searchFoodsLocal = (mot) => API.get(`/foods?search=${encodeURIComponent(mot)}`);

// Recherche dans Open Food Facts API
export const searchFoods = async (query) => {
  try {
    const response = await API.get(`/open-food-facts/search?q=${encodeURIComponent(query)}`);
    return response.data.products || [];
  } catch (error) {
    console.error("Erreur lors de la recherche Open Food Facts:", error);
    return [];
  }
};

