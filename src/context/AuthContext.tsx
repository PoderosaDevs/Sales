import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
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

interface DecodedToken extends Usuario {
  exp?: number;
}

interface AuthContextData {
  authenticated: boolean;
  usuarioData: Usuario | null;
  loading: boolean;
  /** Chame após um login bem-sucedido, passando o token retornado pela API. */
  login: (token: string) => boolean;
  /** Encerra a sessão do usuário e volta para a tela pública. */
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

function isTokenExpired(decoded: DecodedToken): boolean {
  if (!decoded?.exp) return false;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [usuarioData, setUsuarioData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Limpa só o que é do domínio de autenticação — nunca localStorage inteiro,
  // pra não apagar outras preferências salvas pelo usuário (ex: paginação).
  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUsuarioData(null);
  }, []);

  // Decodifica o token e atualiza o estado. Retorna false se o token
  // for inválido ou já estiver expirado, sem lançar exceção.
  const applyToken = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (isTokenExpired(decoded)) return false;

      setUsuarioData({
        id: decoded.id,
        email: decoded.email,
        nome: decoded.nome,
        token_api: token,
        tipo_usuario: decoded.tipo_usuario,
        tipo_sistemas: decoded.tipo_sistemas,
        funcao: decoded.funcao,
        complemento: decoded.complemento,
        cpf: decoded.cpf,
        endereco: decoded.endereco,
        data_nascimento: decoded.data_nascimento,
        is_whatsapp: decoded.is_whatsapp,
        numero: decoded.numero,
        telefone: decoded.telefone,
        cep: decoded.cep,
      });
      setAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const expireSession = useCallback(() => {
    clearSession();
    Swal.fire({
      icon: "warning",
      title: "Sessão Expirada",
      text: "Sua sessão expirou. Por favor, faça login novamente.",
      confirmButtonText: "OK",
    }).then(() => navigate("/"));
  }, [clearSession, navigate]);

  /**
   * Chamado pelas telas de Login/Recuperação de senha após receber o
   * token da API. Atualiza o estado de autenticação imediatamente,
   * sem depender de um re-render "por acaso" pra refletir a mudança.
   */
  const login = useCallback(
    (token: string): boolean => {
      localStorage.setItem("token", token);
      const ok = applyToken(token);
      if (!ok) localStorage.removeItem("token");
      return ok;
    },
    [applyToken]
  );

  const logout = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

  // Verifica o token salvo ao carregar a aplicação. Roda uma única vez
  // na montagem — evita reprocessar/reaplicar o middleware a cada render.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const ok = applyToken(token);
    if (!ok) localStorage.removeItem("token");
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verifica expiração em segundo plano. Decodifica manualmente
  // (sem usar o hook useJwt aqui dentro — hooks não podem ser chamados
  // dentro de callbacks/intervalos, isso violava as Rules of Hooks).
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return;

      try {
        const decoded = jwtDecode<DecodedToken>(currentToken);
        if (isTokenExpired(decoded)) expireSession();
      } catch {
        expireSession();
      }
    }, 60 * 1000); // verifica a cada 1 minuto

    return () => clearInterval(intervalId);
  }, [expireSession]);

  return (
    <AuthContext.Provider
      value={{ authenticated, usuarioData, loading, login, logout }}
    >
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
