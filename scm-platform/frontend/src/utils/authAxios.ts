// src/utils/authAxios.ts or similar

import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:5001/api", // ✅ Update to your backend base
  withCredentials: true, // if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default authAxios;
