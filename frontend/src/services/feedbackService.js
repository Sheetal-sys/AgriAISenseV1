// feedbackService.js
import apiClient from "../api/client";

export const submitFeedback = async (predictionId, feedback) => {
  const response = await apiClient.post("/feedback", {
    prediction_id: predictionId,
    feedback,
  });

  return response.data;
};