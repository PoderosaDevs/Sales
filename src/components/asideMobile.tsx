import React, { useState, useEffect } from "react";
import { IoBagHandleOutline, IoLogOutOutline, IoClose } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase } from "react-icons/gr";
import { AiOutlineProduct } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../utils/navigationUtils";

interface MenuItemConfig {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
}

export function AsideMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { usuarioData } = useAuth();
  const location = useLocation();
  const navigateTo = useNavigation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems: MenuItemConfig[] = [
    { id: "home", icon: RxDashboard, label: "Dashboard", path: "/" },
    { id: "catalog", icon: AiOutlineProduct, label: "Catálogo", path: "/catalog" },
    { id: "vendas", icon: IoBagHandleOutline, label: "Vendas", path: "/vendas" },
  ];

  if (usuarioData?.tipo_usuario !== "EMPLOYEE") {
    menuItems.push({ id: "backoffice", icon: GrDatabase, label: "Backoffice", path: "/backoffice" });
  }

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Botão hambúrguer — mesma linguagem visual do resto do app */}
      <button
        onClick={toggleMenu}
        aria-label="Abrir menu"
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={closeMenu}
        />
      )}

      {/* Painel do menu — dark theme igual ao resto do app, não mais branco */}
      <div
        className={`fixed z-50 left-0 top-0 h-full w-[280px] max-w-[80vw] bg-[#0d0d10] border-r border-white/5 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabeçalho com logo, igual ao aside desktop */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Menu</span>
          </div>
          <button
            onClick={closeMenu}
            aria-label="Fechar menu"
            className="text-gray-500 hover:text-white transition-colors p-2"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Itens de navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map(({ id, icon: Icon, label, path }) => (
              <li key={id}>
                <button
                  onClick={() => navigateTo(path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive(path)
                      ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={22} />
                  <span className="font-semibold text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sair — fixo no rodapé, cor de alerta consistente com o resto do app */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => navigateTo("/sair")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <IoLogOutOutline size={22} />
            <span className="font-semibold text-sm">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}
