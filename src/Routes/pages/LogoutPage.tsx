import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpa o localStorage
    localStorage.clear();
    // Navega para a página inicial
    navigate("/");
  }, [navigate]); // Adicionando navigate como dependência

  return null; // Não precisa renderizar nada
}
