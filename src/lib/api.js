"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("coworkhub_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveSession = ({ token, user }) => {
  localStorage.setItem("coworkhub_token", token);
  localStorage.setItem("coworkhub_user", JSON.stringify(user));
};

export const getSessionUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("coworkhub_user");
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  localStorage.removeItem("coworkhub_token");
  localStorage.removeItem("coworkhub_user");
};

export default api;
