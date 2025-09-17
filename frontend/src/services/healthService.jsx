import API from "./api";

// Ajouter une entrée santé
export const addHealthEntry = (data) => API.post("/health", data);

// Récupérer toutes les entrées santé
export const getHealthEntries = () => API.get("/health");

// Supprimer une entrée santé
export const deleteHealthEntry = (id) => API.delete(`/health/${id}`);
