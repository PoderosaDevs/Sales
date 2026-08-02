import { useNavigate, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase } from "react-icons/gr";
import { AiOutlineProduct } from "react-icons/ai";
import { IoBagHandleOutline, IoLogOutOutline, IoPersonOutline, IoSettingsOutline, IoHelpCircleOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { Tooltip } from "./Tooltip";
import { TipoPessoa } from "../types";

const primaryItems = [
  { id: "home", icon: RxDashboard, label: "Dashboard", path: "/" },
  { id: "catalog", icon: AiOutlineProduct, label: "Catálogo", path: "/catalog" },
  { id: "vendas", icon: IoBagHandleOutline, label: "Vendas", path: "/vendas" },
];

const secondaryItems = [
  { id: "perfil", icon: IoPersonOutline, label: "Perfil", path: "/perfil" },
  { id: "configuracoes", icon: IoSettingsOutline, label: "Configurações", path: "/configuracoes" },
  { id: "ajuda", icon: IoHelpCircleOutline, label: "Ajuda", path: "/ajuda" },
];

export function Aside() {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  const MenuItem = ({ id, icon: Icon, label, path }: { id: string; icon: any; label: string; path: string }) => (
    <li className="relative flex justify-center">
      <Tooltip tooltipText={label}>
        <button
          onClick={() => navigate(path)}
          className={`p-4 rounded-2xl transition-all duration-300 relative ${
            isActive(path)
              ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              : "text-gray-500 hover:text-emerald-400 hover:bg-white/[0.03]"
          }`}
        >
          <Icon size={24} />
        </button>
      </Tooltip>
      {isActive(path) && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_#10b981]" />
      )}
    </li>
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-24 bg-[#0d0d10] border-r border-white/5 flex flex-col items-center py-10 z-50">
      <div className="mb-12">
        <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-white font-bold text-xl">V</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-8 overflow-y-auto custom-scrollbar">
        <ul className="space-y-8">
          {primaryItems.map((item) => (
            <MenuItem key={item.id} {...item} />
          ))}
          {usuario?.tipo_pessoa !== TipoPessoa.EMPLOYEE && (
            <MenuItem id="backoffice" icon={GrDatabase} label="Backoffice" path="/backoffice" />
          )}
        </ul>
        <div className="w-8 h-px bg-white/5" />
        <ul className="space-y-8">
          {secondaryItems.map((item) => (
            <MenuItem key={item.id} {...item} />
          ))}
        </ul>
      </nav>

      <button
        onClick={logout}
        className="p-4 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300"
      >
        <IoLogOutOutline size={24} />
      </button>
    </aside>
  );
}
