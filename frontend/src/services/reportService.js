// reportService.js
import apiClient from "../api/client";

export const generateReport = async (data) => {
  const response = await apiClient.post("/generate-report", data, {
    responseType: "blob",
  });

  return response.data;
};