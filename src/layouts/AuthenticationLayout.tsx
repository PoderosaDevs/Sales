import React from "react";
import { Outlet } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

export function AuthenticationLayout() {
  const adjetivos = [
    "Excelência", "Agilidade", "Confiança", "Inovação", 
    "Parceria", "Qualidade", "Segurança", "Solidez"
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0a0a0c] font-sans selection:bg-emerald-500/30">
      
      {/* Lado Esquerdo: Área de Login */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 xl:px-20 relative z-10 bg-[#0d0d10] border-r border-white/5">
        
        {/* Logo Branding - CENTRALIZADO */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-white font-bold tracking-tighter text-lg uppercase">
            Paraíso <span className="text-emerald-500 font-light">Distribuidora</span>
          </span>
        </div>

        {/* Conteúdo Central (Formulário) */}
        <div className="w-full max-w-md mx-auto">
          <header className="mb-10 text-center"> {/* Centralizado no mobile, esquerda no desktop se preferir */}
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Portal do Parceiro
            </h1>
            <p className="text-gray-400 font-medium">
              Gestão inteligente para o seu negócio.
            </p>
          </header>

          <Outlet />
        </div>
        
        {/* Footer - CENTRALIZADO */}
        <footer className="absolute bottom-8 left-0 right-0 text-center text-gray-600 text-[10px] uppercase tracking-[2px] px-4">
          &copy; {new Date().getFullYear()} Paraíso Distribuidora — Todos os direitos reservados.
        </footer>
      </div>

      {/* Lado Direito: Visual */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden items-center justify-center bg-[#070708]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center space-y-6">
          <h2 className="text-6xl xl:text-8xl font-black text-white/90 tracking-tighter leading-none">
            PARAÍSO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              <Typewriter
                words={adjetivos}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={2500}
              />
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto font-medium">
            Conectando o mercado às melhores soluções de distribuição com tecnologia de ponta.
          </p>
        </div>
      </div>
    </div>
  );
}