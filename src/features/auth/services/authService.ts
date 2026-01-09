import { apiFetch } from "../../../shared/api/client";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "buyer" | "agent" | "admin";
  status: "active" | "suspended";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export const login = (email: string, password: string) =>
  apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (payload: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: "buyer" | "agent" | "admin";
}) =>
  apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const forgotPassword = (email: string) =>
  apiFetch<{ message: string; token?: string | null }>(
    "/api/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );

export const resetPassword = (token: string, newPassword: string) =>
  apiFetch<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });

export const changePassword = (
  currentPassword: string,
  newPassword: string
) =>
  apiFetch<{ message: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
    auth: true,
  });
