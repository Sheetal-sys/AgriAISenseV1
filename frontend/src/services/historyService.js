import apiClient from "../api/client";

export const getHistory = async (
  page = 1,
  limit = 10
) => {
  const response = await apiClient.get(
    `/history?page=${page}&limit=${limit}`
  );

  return response.data;
};