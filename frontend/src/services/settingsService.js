import apiClient from "../api/client";

export const getSettings = async () => {
  const response = await apiClient.get("/user/settings");
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await apiClient.put("/user/settings", data);
  return response.data;
};