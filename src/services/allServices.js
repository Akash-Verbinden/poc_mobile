import { apiService } from "./axios";

// Login
export const loginUser = async (payload) => {
  const response = await apiService.post("/auth/login", payload);
  return response.data;
};