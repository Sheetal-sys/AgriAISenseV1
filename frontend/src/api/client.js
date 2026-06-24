// frontend/src/api/client.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 30000
});

export default apiClient;