import {
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
import { api, extractErrorMessage } from "../lib/api";
import { TipoPessoa, Usuario } from "../types";

interface DecodedToken {
  id: number;
  nome: string;
  email: string;
  funcao?: string | null;
  tipo_pessoa: TipoPessoa;
  cpf?: string | null;
  exp?: number;
}

interface AuthContextData {
  authenticated: boolean;
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function isTokenExpired(decoded: DecodedToken): boolean {
  if (!decoded?.exp) return false;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUsuario(null);
  }, []);

  const applyToken = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (isTokenExpired(decoded)) return false;

      setUsuario({
        id: decoded.id,
        uuid: "",
        nome: decoded.nome,
        email: decoded.email,
        funcao: decoded.funcao,
        tipo_pessoa: decoded.tipo_pessoa,
        cpf: decoded.cpf,
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
      title: "Sessão expirada",
      text: "Sua sessão expirou. Faça login novamente.",
      confirmButtonText: "OK",
      background: "#0d0d10",
      color: "#fff",
      confirmButtonColor: "#10b981",
    }).then(() => navigate("/"));
  }, [clearSession, navigate]);

  const login = useCallback(
    async (email: string, senha: string): Promise<boolean> => {
      try {
        const { data } = await api.post("/auth/login", { email, senha });
        localStorage.setItem("token", data.token);
        const ok = applyToken(data.token);
        if (!ok) localStorage.removeItem("token");
        return ok;
      } catch (error) {
        throw new Error(extractErrorMessage(error, "Não foi possível entrar."));
      }
    },
    [applyToken]
  );

  const logout = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

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
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [expireSession]);

  useEffect(() => {
    const handler = () => expireSession();
    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [expireSession]);

  return (
    <AuthContext.Provider value={{ authenticated, usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
