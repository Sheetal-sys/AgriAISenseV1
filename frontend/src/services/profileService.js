import apiClient from "../api/client";

export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await apiClient.put("/profile", data);
  return response.data;
};