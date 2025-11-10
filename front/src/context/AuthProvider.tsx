import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as auth from "@/services/auth.service";
import { AuthContext } from "./AuthContext";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading: loading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: auth.getMe,
    enabled: !!localStorage.getItem("token"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = async (payload: LoginPayload) => {
    const u = await auth.login(payload);
    queryClient.setQueryData(["auth", "me"], u);
  };

  const register = async (payload: RegisterPayload) => {
    const u = await auth.register(payload);
    queryClient.setQueryData(["auth", "me"], u);
  };

  const logout = () => {
    auth.logout();
    queryClient.setQueryData(["auth", "me"], null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};