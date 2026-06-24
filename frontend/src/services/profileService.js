import apiClient from "../api/client";

export const getProfile = async () => {
  const response = await apiClient.get("/user/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await apiClient.put("/user/profile", data);
  return response.data;
};