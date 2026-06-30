import apiClient from "../api/client";

export const getHistory = async ({
  page = 1,
  limit = 10,
  search = "",
  crop = "",
  status = "",
  severity = "",
  sort = "-created_at",
} = {}) => {
  const response = await apiClient.get("/history", {
    params: {
      page,
      limit,
      search,
      crop,
      status,
      severity,
      sort,
    },
  });

  return response.data;
};