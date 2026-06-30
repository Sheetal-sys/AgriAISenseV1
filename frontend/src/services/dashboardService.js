import apiClient from "../api/client";

export const getFullDashboard = async () => {
  const response = await apiClient.get("/dashboard/full");
  return response.data;
};

export const getModelStatus = async () => {
  const response = await apiClient.get("/system/model-status");
  return response.data;
};