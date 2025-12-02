import API from "../services/api";

export const saveFoodEntries = (entries) => {
  return API.post("/food-entries", entries);
};

export const getFoodEntries = () => {
  return API.get("/food-entries");
};
