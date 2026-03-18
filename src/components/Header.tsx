import React, { useState } from 'react';
import { FaUser, FaChevronDown } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext"; // Assumindo que você tem os dados do user aqui

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { usuarioData } = useAuth(); // Para exibir o nome do usuário real

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1600px] mx-auto py-5 px-6 lg:px-10 flex items-center justify-between">
        
        {/* Lado Esquerdo: Título Dinâmico */}
        <div className="flex items-center gap-4">
          <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
          <h1 className="font-bold text-xl lg:text-2xl text-white tracking-tight">
            {title}
          </h1>
        </div>

        {/* Lado Direito: Perfil do Usuário */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] transition-all group"
          >
            {/* Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg">
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

            <FaChevronDown 
              size={10} 
              className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-[#0d0d10] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                Meus Dados
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                Configurações
              </button>
              <div className="h-px bg-white/5 my-2" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-semibold">
                Sair
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}