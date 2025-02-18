import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

export function AuthenticationLayout() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth >= 1025 && window.innerWidth <= 1400
  );

  const adjetivos = [
    "confiante",
    "persistente",
    "corajosa",
    "resiliente",
    "elegante",
    "autêntica",
    "independente",
    "forte",
    "brilhante",
    "determinada",
    "dedicada",
    "valente",
    "digna",
    "carismática",
    "poderosa",
  ];

  // Função que verifica o tamanho da tela e atualiza o estado
  const handleResize = () => {
    const width = window.innerWidth;
    setIsLargeScreen(width >= 1024);
    setIsMediumScreen(width >= 1025 && width <= 1400);
  };

  useEffect(() => {
    // Adiciona o event listener para verificar o redimensionamento da janela
    window.addEventListener("resize", handleResize);

    // Remove o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div
        className="h-full lg:flex bg-slate-100 flex-col items-center justify-center px-4 md:flex md:justify-center sm:flex sm:justify-center"
        id="responsive-layout"
      >
        <div className="text-center space-y-4 flex flex-col items-center">
          <img
            src="https://media.graphassets.com/1ueVAwCoS6yTxCUa2mCX"
            width={80}
            alt="Logo"
          />
          <h1 className="font-bold text-3xl text-[#2E2A47]">
            Bem vindo de volta!
          </h1>
          <p className="text-base font-semibold text-[#7E8CA0]">
            Entre ou crie uma conta para acessar seu painel!
          </p>
        </div>
        <div
          className="flex items-center justify-center mt-8"
          id="isMobileContentForm"
        >
          <Outlet />
        </div>
      </div>
      <div className="h-full bg-custom-gradient hidden lg:flex items-center justify-center">
        {isLargeScreen && (
          <div className="w-5/6 flex justify-center">
            <div className="max-w-[800px]">
              <img
                src="/logo.svg"
                className="max-w-40 mb-10 m-auto"
                alt="Logo"
              />
              <h2
                className={`${
                  isMediumScreen ? "text-3xl" : "text-7xl"
                } font-semibold font-thin text-white italic`}
              >
                <span className="font-bold text-6xl not-italic">
                  <Typewriter
                    words={adjetivos}
                    loop={150}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
                </span>
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
