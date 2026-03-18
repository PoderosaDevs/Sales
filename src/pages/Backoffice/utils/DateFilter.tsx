import React from "react";
import { IoIosClose } from "react-icons/io";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";

type Props = {
  startDate: string | null;
  endDate: string | null;
  onChange: (field: "start" | "end", value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export const DateFilter = ({ startDate, endDate, onChange, onApply, onClear }: Props) => (
  <div className="flex flex-col md:flex-row items-end md:items-center gap-4 animate-in fade-in duration-500">
    
    {/* Campo Data Inicial */}
    <div className="flex flex-col space-y-1.5 w-full md:w-auto">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
        <FaCalendarAlt className="text-emerald-500/50" size={10} />
        Início
      </label>
      <input
        type="date"
        value={startDate ?? ""}
        onChange={(e) => onChange("start", e.target.value)}
        className="bg-[#0a0a0c] border border-white/10 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all [color-scheme:dark] min-w-[150px]"
      />
    </div>

    {/* Campo Data Final */}
    <div className="flex flex-col space-y-1.5 w-full md:w-auto">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
        <FaCalendarAlt className="text-emerald-500/50" size={10} />
        Fim
      </label>
      <input
        type="date"
        value={endDate ?? ""}
        onChange={(e) => onChange("end", e.target.value)}
        className="bg-[#0a0a0c] border border-white/10 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all [color-scheme:dark] min-w-[150px]"
      />
    </div>

    {/* Botões de Ação */}
    <div className="flex items-center gap-2 h-[42px]">
      {startDate && endDate && (
        <button
          onClick={onApply}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[2px] rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <FaFilter size={10} />
          Aplicar
        </button>
      )}

      {(startDate || endDate) && (
        <button
          onClick={onClear}
          className="group flex items-center justify-center w-[42px] h-[42px] bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          title="Limpar filtros"
        >
          <IoIosClose size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  </div>
);