import { api } from "@/lib/api";
import type { User, Role } from "@/types/user";

export const getAllUsers = async (role?: Role): Promise<User[]> => {
  const url = role ? `/user/role/${role}` : "/user";
  const { data } = await api.get<User[]>(url);
  return data;
};

export const getUser = async (id: number) => {
  const { data } = await api.get<User>(`/user/${id}`);
  return data;
};

export const patchUserRole = async (id: number, role: Role) => {
  const { data } = await api.patch<User>(`/user/${id}/role`, { role });
  return data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/user/${id}`);
};