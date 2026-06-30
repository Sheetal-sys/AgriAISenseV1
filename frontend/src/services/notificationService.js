// notificationService.js
import apiClient from "../api/client";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data;
};

export const markNotificationsRead = async () => {
  const response = await apiClient.patch("/notifications/read");
  return response.data;
};