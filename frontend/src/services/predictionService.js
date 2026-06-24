import apiClient from "../api/client";

export const predictDisease = async (formData) => {
  const response = await apiClient.post(
    "/predict",
    formData
  );

  return response.data;
};