import API from "./api";

export const login = ({ email, password }) => {
  return API.post("/auth/login", { email, password });
};

export const register = ({ username, email, password }) => {
  return API.post("/auth/register", { username, email, password });
};

export const updateProfile = ({ username, avatar }) => {
  return API.put("/auth/profile", { username, avatar });
};
