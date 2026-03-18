import { Link } from "react-router-dom";
import { FaStore, FaTags, FaBullseye, FaBoxOpen, FaUsers } from "react-icons/fa";
import { IoChevronForwardOutline } from "react-icons/io5";

export function ManagerModules() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
      
      {/* 1. LOJAS */}
      <Link to="/lojas" className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 hover:border-emerald-500 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FaStore size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-sm leading-none">Lojas</h3>
            <p className="text-slate-500 text-[10px] mt-1">Unidades</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          Gerenciar <IoChevronForwardOutline size={10} />
        </div>
      </Link>

      {/* 2. MARCAS */}
      <Link to="/marcas" className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 hover:border-emerald-500 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FaTags size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-sm leading-none">Marcas</h3>
            <p className="text-slate-500 text-[10px] mt-1">Parceiros</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          Gerenciar <IoChevronForwardOutline size={10} />
        </div>
      </Link>

      {/* 3. METAS */}
      <Link to="/metas" className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 hover:border-emerald-500 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FaBullseye size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-sm leading-none">Metas</h3>
            <p className="text-slate-500 text-[10px] mt-1">Objetivos</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          Gerenciar <IoChevronForwardOutline size={10} />
        </div>
      </Link>

      {/* 4. PRODUTOS */}
      <Link to="/produtos" className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 hover:border-emerald-500 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FaBoxOpen size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-sm leading-none">Produtos</h3>
            <p className="text-slate-500 text-[10px] mt-1">Catálogo</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          Gerenciar <IoChevronForwardOutline size={10} />
        </div>
      </Link>

      {/* 5. FUNCIONÁRIOS */}
      <Link to="/funcionarios" className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 hover:border-emerald-500 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FaUsers size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-sm leading-none">Funcionários</h3>
            <p className="text-slate-500 text-[10px] mt-1">Equipe</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
          Gerenciar <IoChevronForwardOutline size={10} />
        </div>
      </Link>

    </div>
  );
}