import apiClient from "../api/client";

export const getNotifications = async (params = {}) => {
  const response = await apiClient.get("/notifications", { params });
  return response.data;
};

export const createTestNotification = async () => {
  const response = await apiClient.post("/notifications/test");
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await apiClient.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.put("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await apiClient.delete(`/notifications/${notificationId}`);
  return response.data;
};

export const clearNotifications = async () => {
  const response = await apiClient.delete("/notifications");
  return response.data;
};