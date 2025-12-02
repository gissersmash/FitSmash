import API from "../services/api";

export const saveFoodEntries = (entries) => {
  return API.post("/food-entries", entries);
};

export const getFoodEntries = () => {
  return API.get("/food-entries");
};

export const addFoodEntry = async (foodData) => {
  try {
    const response = await API.post("/food-entries", {
      food_id: foodData.id || null,
      name: foodData.name,
      calories: Number(foodData.calories),
      image: foodData.image_url || null,
      date: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Erreur ajout aliment:', error.response?.data || error);
    throw error;
  }
};

export const deleteFoodEntry = async (id) => {
  try {
    const response = await API.delete(`/food-entries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur suppression:', error);
    throw error;
  }
};
