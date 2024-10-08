import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

export function AuthenticationLayout() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

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
    setIsLargeScreen(window.innerWidth >= 1024);
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
    <div className="bg-custom-gradient h-screen w-full flex justify-center items-center">
      {/* Verifica se a tela é grande para renderizar o conteúdo */}
      {isLargeScreen && (
        <div className="w-3/6 flex justify-center">
          <div className="max-w-[800px]">
            <h2 className="text-5xl font-semibold font-thin text-white italic">
              Você escolheu entrar na <span className="font-semibold ">Paraiso</span>
              <br />
              e se tornar uma pessoa
              <br />
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
      <Outlet />
    </div>
  );
}
