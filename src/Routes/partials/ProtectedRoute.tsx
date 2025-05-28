import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  console.log("[ProtectedRoute] Render started");

  const authContext = useAuth();

  // Log para validar se o hook foi chamado corretamente
  console.log("[ProtectedRoute] useAuth() returned:", authContext);

  if (!authContext) {
    console.error("[ProtectedRoute] useAuth() returned undefined or null. Hook usado fora de contexto?");
    return <Navigate to="/error404" />;
  }

  const { usuarioData } = authContext;

  if (!usuarioData) {
    console.warn("[ProtectedRoute] usuarioData está null. Redirecionando para /error404");
    return <Navigate to="/error404" />;
  }

  if (!allowedRoles.includes(usuarioData.tipo_usuario)) {
    console.warn(`[ProtectedRoute] Tipo de usuário '${usuarioData.tipo_usuario}' não permitido. Redirecionando para /error404`);
    return <Navigate to="/error404" />;
  }

  console.log("[ProtectedRoute] Acesso permitido, renderizando children.");
  return children;
}
