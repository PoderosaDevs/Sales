import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { gql } from "@apollo/client";
import { client } from "../services/conection";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import { useJwt } from "react-jwt";
import Swal from "sweetalert2"; // Importação do SweetAlert2
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: string;
  email: string;
  nome: string;
  token_api: string;
  tipo_usuario: string;
  tipo_sistemas: string[];
}

interface AuthContextData {
  authenticated: boolean;
  usuarioData: Usuario | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const navigate = useNavigate(); // Hook para redirecionamento

  // Hook useJwt para decodificar e verificar o token
  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt<Usuario>(token || "");

  useEffect(() => {
    if (token && !isExpired) {
      client.setLink(client.link.concat(authMiddleware)); // Certifique-se de usar o middleware para autenticação
      setAuthenticated(true);

      // Definir usuarioData com base nos dados do decodedToken
      if (decodedToken) {
        const userData = {
          id: decodedToken.id,
          email: decodedToken.email,
          nome: decodedToken.nome,
          token_api: token,
          tipo_usuario: decodedToken.tipo_usuario,
          tipo_sistemas: decodedToken.tipo_sistemas,
        };
        setUsuarioData(userData);
      }
    } else if (token && isExpired) {
      setAuthenticated(false);

      // Exibir Swal quando o token expirar
      Swal.fire({
        icon: "warning",
        title: "Sessão Expirada",
        text: "Sua sessão expirou. Por favor, faça login novamente.",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token"); // Remover o token do localStorage
        navigate("/logout"); // Redirecionar para a página de logout
      });
    }
  }, [token, isExpired, decodedToken, navigate]);

  return (
    <AuthContext.Provider value={{ authenticated, usuarioData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
