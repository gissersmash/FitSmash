import API from "../services/api";

export const saveNutritionGoals = (goals) => {
  // Transforme les objectifs pour correspondre au format attendu
  const formattedGoals = goals.map(obj => ({
    type: obj.type,
    value: obj.objectif
  }));
  return API.post("/goals", { goals: formattedGoals });
};

export const getNutritionGoals = () => {
  return API.get("/goals");
};
