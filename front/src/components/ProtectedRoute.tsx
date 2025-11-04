import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/user";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: Role;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Attendre le chargement de l'utilisateur
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si pas connecté, rediriger vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle spécifique est requis et que l'utilisateur ne l'a pas
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
