// frontend/src/services/objectiveService.js
import API from "./api";

export const getObjectives = () => {
  console.log("➡️ GET /objectives");
  return API.get("/objectives");
};

export const createObjective = (data) => {
  console.log("➡️ POST /objectives avec :", data);
  return API.post("/objectives", data);
};

export const updateObjective = (id, data) => {
  console.log(`➡️ PUT /objectives/${id} avec :`, data);
  return API.put(`/objectives/${id}`, data);
};

export const deleteObjective = (id) => {
  console.log(`➡️ DELETE /objectives/${id}`);
  return API.delete(`/objectives/${id}`);
};
