import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    // logout() já limpa o token, atualiza o estado de autenticação
    // e navega pra "/" — não usamos mais localStorage.clear(), que
    // apagava também preferências não relacionadas a login (ex:
    // quantidade de itens por página salva em outras telas).
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // Não precisa renderizar nada
}
