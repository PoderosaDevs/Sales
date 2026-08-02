import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Aside } from "../components/Aside";
import { AsideMobile } from "../components/AsideMobile";
import { Header } from "../components/Header";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { routeTitles } from "../routes/routeConfig";

export function AppLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? "Dashboard";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans">
      {!isMobile && <Aside />}
      {isMobile && <AsideMobile />}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${!isMobile ? "pl-24" : "pl-0"}`}>
        <Header title={title} />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
