// frontend/src/services/objectiveService.js
import API from "./api";

export const getObjectives = () => API.get("/objectives");
export const createObjective = (data) => API.post("/objectives", data);
export const updateObjective = (id, data) => API.put(`/objectives/${id}`, data);
export const deleteObjective = (id) => API.delete(`/objectives/${id}`);
