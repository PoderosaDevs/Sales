import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
