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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: string;
  email: string;
  nome: string;
  token_api: string;
  tipo_usuario: string;
  tipo_sistemas: string[];
  data_nascimento?: Date;
  funcao?: string;
  complemento?: string;
  cpf?: string;
  endereco?: string;
  is_whatsapp?: boolean;
  numero?: string;
  telefone?: string;
  cep?: string;
}

interface AuthContextData {
  authenticated: boolean;
  usuarioData: Usuario | null;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt<Usuario>(token || "");

  useEffect(() => {
    console.log("[AuthProvider] useEffect disparado");
    console.log("[AuthProvider] Token:", token);
    console.log("[AuthProvider] isExpired:", isExpired);
    console.log("[AuthProvider] decodedToken:", decodedToken);

    if (!token) {
      console.log("[AuthProvider] Sem token no localStorage");
      setAuthenticated(false);
      setUsuarioData(null);
      setLoading(false);
      return;
    }

    if (isExpired) {
      console.log("[AuthProvider] Token expirado");
      Swal.fire({
        icon: "warning",
        title: "Sessão Expirada",
        text: "Sua sessão expirou. Por favor, faça login novamente.",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token");
        setAuthenticated(false);
        setUsuarioData(null);
        setLoading(false);
        navigate("/");
      });
      return;
    }

    if (decodedToken) {
      const userData: Usuario = {
        id: decodedToken.id,
        email: decodedToken.email,
        nome: decodedToken.nome,
        token_api: token,
        tipo_usuario: decodedToken.tipo_usuario,
        tipo_sistemas: decodedToken.tipo_sistemas,
        funcao: decodedToken.funcao,
        complemento: decodedToken.complemento,
        cpf: decodedToken.cpf,
        endereco: decodedToken.endereco,
        data_nascimento: decodedToken.data_nascimento,
        is_whatsapp: decodedToken.is_whatsapp,
        numero: decodedToken.numero,
        telefone: decodedToken.telefone,
        cep: decodedToken.cep,
      };

      console.log("[AuthProvider] Usuário autenticado:", userData);
      client.setLink(client.link.concat(authMiddleware));
      setAuthenticated(true);
      setUsuarioData(userData);
      setLoading(false);
    } else {
      console.warn("[AuthProvider] decodedToken inválido ou vazio");
      setAuthenticated(false);
      setUsuarioData(null);
      setLoading(false);
    }
  }, [token, isExpired, decodedToken, navigate]);

  // Opcional: Monitorar expiração em background
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const { isExpired: tokenExpired } = useJwt<Usuario>(currentToken || "");

      if (tokenExpired) {
        console.log("[AuthProvider] Token expirou no background");
        Swal.fire({
          icon: "warning",
          title: "Sessão Expirada",
          text: "Sua sessão expirou. Por favor, faça login novamente.",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("token");
          setAuthenticated(false);
          setUsuarioData(null);
          navigate("/");
        });
      }
    }, 60 * 1000); // Verifica a cada 1 minuto

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ authenticated, usuarioData, loading }}>
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
