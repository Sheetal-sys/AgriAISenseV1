// predictionService.js
import apiClient from "../api/client";

export const predictDisease = async (formData) => {
  const response = await apiClient.post("/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};