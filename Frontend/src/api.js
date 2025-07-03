import axios from "axios";

// Automatically uses Render URL in production and localhost in dev
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
  withCredentials: true, // if you're using cookies/auth
});

export default API;
