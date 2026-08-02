import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { useAuth } from "../context/AuthContext";

export function AppRoutes() {
  const { authenticated, loading } = useAuth();

  // Enquanto o AuthProvider ainda verifica o token salvo, evita decidir
  // entre rotas públicas/privadas para não piscar a tela de login.
  if (loading) {
    return <div className="min-h-screen w-full bg-[#0a0a0c]" />;
  }

  return (
    <Routes>
      {authenticated ? <Route path="/*" element={<PrivateRoutes />} /> : <Route path="/*" element={<PublicRoutes />} />}
    </Routes>
  );
}
