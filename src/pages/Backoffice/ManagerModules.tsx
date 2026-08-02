import { Link } from "react-router-dom";
import { FaPalette, FaBoxOpen, FaStream, FaStore, FaBullseye, FaUserTie } from "react-icons/fa";

const modules = [
  { to: "/produtos", icon: FaBoxOpen, label: "Produtos" },
  { to: "/marcas", icon: FaPalette, label: "Marcas" },
  { to: "/linhas", icon: FaStream, label: "Linhas" },
  { to: "/lojas", icon: FaStore, label: "Lojas" },
  { to: "/metas", icon: FaBullseye, label: "Metas" },
  { to: "/funcionarios", icon: FaUserTie, label: "Equipe" },
];

export function ManagerModules() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {modules.map((m) => (
        <Link
          key={m.to}
          to={m.to}
          className="flex flex-col items-center justify-center gap-3 p-5 bg-white/[0.02] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group"
        >
          <div className="p-3 bg-white/5 group-hover:bg-emerald-500/20 rounded-xl text-gray-400 group-hover:text-emerald-500 transition-all">
            <m.icon size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{m.label}</span>
        </Link>
      ))}
    </div>
  );
}
