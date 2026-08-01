import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./Public";
import { PrivateRoutes } from "./Private";
import { useAuth } from "../context/AuthContext";

export function AppRoutes() {
  const { authenticated, loading } = useAuth();

  // Enquanto o AuthProvider ainda está checando o token salvo,
  // não decide entre rotas públicas/privadas — evita o "flash" da
  // tela de login para quem já está autenticado ao recarregar a página.
  // Usa fundo escuro explícito (o body não tem dark mode via CSS,
  // cada página define seu próprio fundo) pra não piscar tela branca.
  if (loading) {
    return <div className="min-h-screen w-full bg-[#0a0a0c]" />;
  }

  return (
    <Routes>
      {authenticated ? (
        <Route path="/*" element={<PrivateRoutes />} />
      ) : (
        <Route path="/*" element={<PublicRoutes />} />
      )}
    </Routes>
  );
}
