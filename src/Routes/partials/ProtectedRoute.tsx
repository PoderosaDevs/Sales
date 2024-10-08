import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // Lista de tipos de usuário permitidos
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuarioData } = useAuth();

  // Log para verificar o estado do usuário
  console.log("usuarioData:", usuarioData);

  // Se não houver usuarioData, redireciona para a página de erro
  if (!usuarioData) {
    console.log("Usuário não autenticado, redirecionando para erro.");
    return <Navigate to="/error404" />;
  }

  // Se o tipo de usuário não estiver na lista de permitidos, redireciona para a página de erro
  if (!allowedRoles.includes(usuarioData.tipo_usuario)) {
    console.log(`Acesso negado para o tipo de usuário: ${usuarioData.tipo_usuario}. Redirecionando para erro.`);
    return <Navigate to="/error404" />;
  }

  return children;
}
