import axios from "axios";

// API URL
const API_URL = "http://localhost:3008";

// Function to upload file
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Function to fetch report data
export const getReport = (reportId) => {
  return axios.get(`${API_URL}/report/${reportId}`);
};
