import axios from "axios";

const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
  withCredentials: true, // ✅ if you're using cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

export default authAxios;
