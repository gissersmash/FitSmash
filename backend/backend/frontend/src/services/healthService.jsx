import API from "./api";

// Entrées santé
export const getHealthEntries = () => API.get("/health");
export const addHealthEntry = (data) => API.post("/health", data);
export const deleteHealthEntry = (id) => API.delete(`/health/${id}`);
export const getStats = (period) => API.get(`/health/stats/${period}`);
