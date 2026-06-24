import api from "../api/client";

export const generateReport = async (data) => {
  const response = await api.post(
    "/generate-report",
    data,
    {
      responseType: "blob"
    }
  );

  return response.data;
};