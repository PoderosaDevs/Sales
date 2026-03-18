import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { routeTitles } from "../Routes/routeConfig";
import { AsideMobile } from "../components/asideMobile";

export function AppLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const currentPath = location.pathname;
  const title = routeTitles[currentPath] || "Dashboard";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      {!isMobile && <Aside />}

      {/* Sidebar Mobile */}
      {isMobile && <AsideMobile />}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${!isMobile ? "pl-24" : "pl-0"}`}>
        {/* Header com Glassmorphism */}
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* O conteúdo das páginas (Outlet) deve usar cards bg-[#0d0d10] e border-white/10 */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}