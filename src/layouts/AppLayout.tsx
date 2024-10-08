import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { routeTitles } from "../Routes/routeConfig";
import { AsideMobile } from "../components/asideMobile";

export function AppLayout() {
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const location = useLocation();
  const currentPath = location.pathname;
  const title = routeTitles[currentPath] || "Default Title";

  // Atualiza o estado de isMobile com base na largura da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    // Limpeza do listener ao desmontar o componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {isMobile ? (
        <AsideMobile /> // Exibe AsideMobile em telas menores que 1024px
      ) : (
        <Aside setIsSecondaryOpen={setIsSecondaryOpen} /> // Exibe Aside em telas maiores ou iguais a 1024px
      )}

      <div className={`flex-1 ml-[0px] flex flex-col transition-all duration-300 ease-in-out ${isMobile ? 'pl-0' : 'pl-[120px]'}`}>
        <Header title={title} />
        <main className="flex-1 pt-2 bg-[#f5f5f5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
