import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authContext = useAuth();

  if (!authContext) {
    return <Navigate to="/error404" />;
  }

  const { usuarioData } = authContext;

  if (!usuarioData) {
    return <Navigate to="/error404" />;
  }

  if (!allowedRoles.includes(usuarioData.tipo_usuario)) {
    return <Navigate to="/error404" />;
  }

  return children;
}
