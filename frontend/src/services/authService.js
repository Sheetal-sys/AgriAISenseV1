import apiClient from "../api/client";

export const registerUser = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await apiClient.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};