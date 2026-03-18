import React, { useState, useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Tooltip } from "./Tooltip";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../utils/navigationUtils";
import { AiOutlineProduct } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";

interface AsideProps {}

type IconType = "home" | "user" | "cog" | "vendas" | "catalog" | "backoffice";

export function Aside() {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const { usuarioData } = useAuth();
  const location = useLocation();
  const navigateTo = useNavigation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveIcon("home");
    else if (path.includes("catalog")) setActiveIcon("catalog");
    else if (path.includes("vendas")) setActiveIcon("vendas");
    else if (path.includes("backoffice")) setActiveIcon("backoffice");
  }, [location.pathname]);

  const MenuItem = ({ id, icon: Icon, label, path }: any) => (
    <li className="relative group flex justify-center">
      <Tooltip tooltipText={label}>
        <button
          onClick={() => navigateTo(path)}
          className={`p-4 rounded-2xl transition-all duration-300 relative ${
            activeIcon === id 
            ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
            : "text-gray-500 hover:text-emerald-400 hover:bg-white/[0.03]"
          }`}
        >
          <Icon size={26} />
        </button>
      </Tooltip>
      {/* Indicador Ativo Lateral */}
      {activeIcon === id && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_#10b981]" />
      )}
    </li>
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-24 bg-[#0d0d10] border-r border-white/5 flex flex-col items-center py-10 z-50">
      {/* Logo idêntica à do Login */}
      <div className="mb-14">
        <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-white font-bold text-xl">P</span>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-8">
          <MenuItem id="home" icon={RxDashboard} label="Dashboard" path="/" />
          <MenuItem id="catalog" icon={AiOutlineProduct} label="Catálogo" path="/catalog" />
          <MenuItem id="vendas" icon={IoBagHandleOutline} label="Vendas" path="/vendas" />
          {usuarioData?.tipo_usuario !== 'EMPLOYEE' && (
            <MenuItem id="backoffice" icon={GrDatabase} label="Backoffice" path="/backoffice" />
          )}
        </ul>
      </nav>

      {/* Logout com hover em Vermelho Suave */}
      <button
        onClick={() => navigateTo("/sair")}
        className="p-4 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300"
      >
        <IoLogOutOutline size={26} />
      </button>
    </aside>
  );
}
