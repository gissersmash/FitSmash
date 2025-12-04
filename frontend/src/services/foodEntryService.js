import API from "../services/api";

export const saveFoodEntries = (entries) => {
  return API.post("/food-entries", entries);
};

export const getFoodEntries = () => {
  return API.get("/food-entries");
};

export const addFoodEntry = (foodData) => {
  return API.post("/food-entries", foodData);
};

export const deleteFoodEntry = (id) => {
  return API.delete(`/food-entries/${id}`);
};
