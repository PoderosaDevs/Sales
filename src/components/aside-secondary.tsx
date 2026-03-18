import React, { useState, useEffect } from "react";
import { MenuUser } from "./menu-user";
import { MenuBackoffice } from "./menu-backoffice";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineProduct } from "react-icons/ai";
import { IoBagHandleOutline, IoLogOutOutline } from "react-icons/io5";
import { GrDatabase } from "react-icons/gr";
import { useNavigation } from "@/utils/navigationUtils";

interface AsideSecondaryProps {
  isOpen: boolean;
  activeIcon:
    | "home"
    | "user"
    | "cog"
    | "vendas"
    | "catalog"
    | "backoffice"
    | null;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function AsideMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { usuarioData } = useAuth();
  const location = useLocation();
  const navigateTo = useNavigation();

  const menuItems = [
    { id: "home", label: "Dashboard", icon: RxDashboard, path: "/" },
    {
      id: "catalog",
      label: "Catálogo",
      icon: AiOutlineProduct,
      path: "/catalog",
    },
    {
      id: "vendas",
      label: "Vendas",
      icon: IoBagHandleOutline,
      path: "/vendas",
    },
    {
      id: "backoffice",
      label: "Backoffice",
      icon: GrDatabase,
      path: "/backoffice",
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Trigger Glassmorphism */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-[60] p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/40 lg:hidden active:scale-95 transition-transform"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-[#0d0d10] border-r border-white/10 z-[80] transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-10 flex flex-col items-center border-b border-white/5">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-emerald-500/20">
              P
            </div>
            <span className="font-bold tracking-[3px] uppercase text-xs text-white">
              Paraíso{" "}
              <span className="text-emerald-500 font-light">Distribuidora</span>
            </span>
          </div>

          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                if (item.adminOnly && usuarioData?.tipo_usuario === "EMPLOYEE")
                  return null;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        navigateTo(item.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                          : "text-gray-500 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <item.icon size={22} />
                      <span className="text-[10px] font-bold uppercase tracking-[2px]">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-8">
            <button
              onClick={() => navigateTo("/sair")}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 font-bold text-[10px] uppercase tracking-[2px] hover:bg-red-500 hover:text-white transition-all"
            >
              <IoLogOutOutline size={20} />
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
