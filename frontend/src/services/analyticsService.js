import apiClient from "../api/client";

export const getAnalytics = async () => {
  const response = await apiClient.get("/analytics");
  return response.data;
};

export const getAnalyticsCharts = async () => {
  const response = await apiClient.get("/analytics/charts");
  return response.data;
};