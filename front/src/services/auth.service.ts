import { api } from "@/lib/api";
import type { User } from "@/types/user";
import type { RegisterPayload, LoginPayload } from "@/types/auth";

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<{ user: User; token: string }>(
    "/auth/register",
    payload
  );
  // Auto-login : stocke le token
  localStorage.setItem("token", data.token);
  return data.user;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<{ user: User; token: string }>(
    "/auth/login",
    payload
  );
  localStorage.setItem("token", data.token);
  return data.user;
};

export const getMe = async () => {
  const { data } = await api.get<User>("/auth/me");
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};