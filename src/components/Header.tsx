import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { usuarioData } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1600px] mx-auto py-5 px-6 lg:px-10 pl-20 lg:pl-10 flex items-center justify-between">
        
        {/* Lado Esquerdo: Título Dinâmico */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] flex-shrink-0" />
          <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-white tracking-tight truncate">
            {title}
          </h1>
        </div>

        {/* Lado Direito: Badge do Usuário — sem dropdown, só informativo */}
        <div className="flex items-center gap-3 p-1.5 pr-3 bg-white/[0.03] border border-white/10 rounded-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <FaUser size={14} />
          </div>
          
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none">
              {usuarioData?.nome || "Usuário"}
            </p>
            <p className="text-[9px] text-emerald-500 font-medium uppercase tracking-tighter mt-1">
              {usuarioData?.tipo_usuario || "Parceiro"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
