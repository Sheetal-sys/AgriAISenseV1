// systemService.js
import apiClient from "../api/client";

export const getSystemStatus = async () => {
  const response = await apiClient.get("/system/status");
  return response.data;
};