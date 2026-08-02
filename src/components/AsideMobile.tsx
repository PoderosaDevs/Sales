import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase } from "react-icons/gr";
import { AiOutlineProduct } from "react-icons/ai";
import {
  IoBagHandleOutline,
  IoLogOutOutline,
  IoClose,
  IoMenu,
  IoPersonOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { TipoPessoa } from "../types";

export function AsideMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setIsOpen(false), [location.pathname]);

  const menuItems = [
    { id: "home", icon: RxDashboard, label: "Dashboard", path: "/" },
    { id: "catalog", icon: AiOutlineProduct, label: "Catálogo", path: "/catalog" },
    { id: "vendas", icon: IoBagHandleOutline, label: "Vendas", path: "/vendas" },
  ];
  if (usuario?.tipo_pessoa !== TipoPessoa.EMPLOYEE) {
    menuItems.push({ id: "backoffice", icon: GrDatabase, label: "Backoffice", path: "/backoffice" });
  }

  const accountItems = [
    { id: "perfil", icon: IoPersonOutline, label: "Perfil", path: "/perfil" },
    { id: "configuracoes", icon: IoSettingsOutline, label: "Configurações", path: "/configuracoes" },
    { id: "ajuda", icon: IoHelpCircleOutline, label: "Ajuda", path: "/ajuda" },
  ];

  const isActive = (path: string) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Abrir menu"
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
      >
        <IoMenu size={22} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 left-0 top-0 h-full w-[280px] max-w-[80vw] bg-[#0d0d10] border-r border-white/5 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Menu</span>
          </div>
          <button onClick={() => setIsOpen(false)} aria-label="Fechar menu" className="text-gray-500 hover:text-white p-2">
            <IoClose size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map(({ id, icon: Icon, label, path }) => (
              <li key={id}>
                <button
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive(path) ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-white/5" />

          <ul className="space-y-1">
            {accountItems.map(({ id, icon: Icon, label, path }) => (
              <li key={id}>
                <button
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive(path) ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <IoLogOutOutline size={20} />
            <span className="font-semibold text-sm">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}
