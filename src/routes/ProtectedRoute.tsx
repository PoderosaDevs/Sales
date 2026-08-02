import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TipoPessoa } from "../types";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: TipoPessoa[];
}) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/error404" replace />;
  if (!allowedRoles.includes(usuario.tipo_pessoa)) return <Navigate to="/error404" replace />;

  return children;
}
