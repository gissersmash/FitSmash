import API from "./api";

export const addHealthEntry = (data) => API.post("/health", data);
export const getHealthEntries = () => API.get("/health");
export const deleteHealthEntry = (id) => API.delete(`/health/${id}`);
