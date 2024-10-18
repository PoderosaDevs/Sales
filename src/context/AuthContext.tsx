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
    // Se não houver token, não faça nada
    if (!token) {
      setAuthenticated(false);
      setUsuarioData(null);
      return; // Saia do useEffect
    }

    // Token existe, agora verifique se ele está expirado
    if (!isExpired) {
      client.setLink(client.link.concat(authMiddleware)); // Middleware de autenticação
      setAuthenticated(true);

      // Definir usuarioData com base nos dados do decodedToken
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
        setUsuarioData(userData);
      }
    } else {
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const { isExpired } = useJwt<Usuario>(currentToken || "");
      
      if (isExpired) {
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
    }, 1000); // Verifica a expiração a cada segundo

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, [navigate]);

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
