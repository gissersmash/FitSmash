import axios from "axios";

const API_URL = "http://localhost:4000/api/goals";

// Enregistrer des objectifs
export async function saveNutritionGoals(payload) {
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.data.goals || [];
}

// Récupérer les objectifs
export async function getNutritionGoals() {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.data || [];
}
