import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

export const AgentRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/acceso" replace />;
  }

  if (user?.role !== "agent") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
