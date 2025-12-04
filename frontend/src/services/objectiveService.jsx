// frontend/src/services/objectiveService.js
import API from "./api";

export const getObjectives = () => {
  return API.get("/objectives");
};

export const createObjective = (data) => {
  return API.post("/objectives", data);
};

export const updateObjective = (id, data) => {
  return API.put(`/objectives/${id}`, data);
};

export const deleteObjective = (id) => {
  return API.delete(`/objectives/${id}`);
};
