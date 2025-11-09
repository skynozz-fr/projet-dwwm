import { useEffect, useState } from "react";
import * as auth from "@/services/auth.service";
import type { User } from "@/types/user";
import { AuthContext, type RegisterPayload, type LoginPayload } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (localStorage.getItem("token")) {
          const me = await auth.getMe();
          setUser(me);
        }
      } catch (error) {
        // Token invalide ou expiré, on ne fait rien
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    const u = await auth.login(payload);
    setUser(u);
  };

  const register = async (payload: RegisterPayload) => {
    const u = await auth.register(payload);
    setUser(u);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};