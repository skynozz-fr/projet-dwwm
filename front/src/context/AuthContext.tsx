import { createContext } from "react";
import type { User } from "@/types/user";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});