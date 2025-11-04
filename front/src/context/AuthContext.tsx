import { createContext } from "react";
import type { User } from "@/types/user";

export type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});