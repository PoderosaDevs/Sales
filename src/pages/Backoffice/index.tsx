import React, { useState, useRef, useEffect } from "react";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { RankingFuncionarios } from "./TableComponents/RankingFuncionarios";
import { RankingLojas } from "./TableComponents/RankingLojas";
import { RankingMarcas } from "./TableComponents/RankingMarcas";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { FaXmark, FaCalendarDays, FaFilter } from "react-icons/fa6";
import { ManagerModules } from "./TableComponents/ManagerModules";

export function Backoffice() {
  const { usuarioData } = useAuth();
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const { data } = QueryGetVendasByUsuarioID({
    variables: { getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0 },
    skip: !usuarioData,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!usuarioData) return null;

  const formatDateToDDMMYYYY = (date: Date | undefined) => date ? date.toLocaleDateString("pt-BR") : "";
  const isRangeComplete = range?.from && range?.to;
  const startDateFormatted = formatDateToDDMMYYYY(range?.from);
  const endDateFormatted = formatDateToDDMMYYYY(range?.to);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER: Welcome & Date Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Painel de <span className="text-emerald-500 font-light">Gestão</span>
            </h1>
          </div>
          <p className="text-gray-400 text-base ml-5">Visão estratégica e análise de performance.</p>
        </div>

        {/* CONTROLE DE DATA PREMIUM */}
        <div className="relative flex items-center gap-4 self-start lg:self-center">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-[2px] mr-2">
            <FaFilter className="text-emerald-500" size={14} /> Período:
          </div>
          
          <div className="relative">
            {isRangeComplete ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPopupVisible(!isPopupVisible)}
                  className="bg-[#0d0d10] border border-emerald-500/30 text-emerald-500 px-6 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-emerald-500/5 transition-all flex items-center gap-3"
                >
                  <FaCalendarDays size={16} />
                  {startDateFormatted} — {endDateFormatted}
                </button>
                <button
                  onClick={() => setRange(undefined)}
                  className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <FaXmark size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPopupVisible(!isPopupVisible)}
                className="bg-[#0d0d10] border border-white/10 text-gray-300 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-[2px] hover:bg-white/5 transition-all flex items-center gap-3"
              >
                <FaCalendarDays className="text-emerald-500" size={16} />
                Selecionar Intervalo
              </button>
            )}

            {/* POPUP CALENDÁRIO DARK */}
            {isPopupVisible && (
              <div
                ref={popupRef}
                className="absolute right-0 top-full mt-4 z-50 bg-[#0d0d10] border border-white/10 p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200"
              >
                <style>{`
                  .rdp { --rdp-accent-color: #10b981; --rdp-background-color: #1a1a1e; margin: 0; }
                  .rdp-day_selected { background-color: #10b981 !important; color: #000 !important; font-weight: bold; }
                  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(16,185,129,0.1); color: #10b981; }
                  .rdp-caption_label { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #fff; }
                  .rdp-head_cell { font-size: 12px; font-weight: 800; color: #4b5563; text-transform: uppercase; }
                  .rdp-day { color: #9ca3af; border-radius: 8px; font-size: 14px; }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  locale={ptBR}
                  className="text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MÓDULOS DE GERENCIAMENTO (Card Principal) */}
      <section className="bg-[#0d0d10] border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/10" />
        <div className="relative z-10">
            <header className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <FaFilter size={20} />
                </div>
                <h2 className="text-base font-black text-white uppercase tracking-[3px]">Módulos de Gerenciamento</h2>
            </header>
            <ManagerModules />
        </div>
      </section>

      {/* GRID DE RANKINGS / BI */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* RANKING FUNCIONÁRIOS */}
        <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-xl">
          <header className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Ranking de Vendedores</h2>
            <div className="h-px flex-1 bg-white/5 mx-6" />
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Top Performers</span>
          </header>
          <RankingFuncionarios
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>

        {/* RANKING MARCAS */}
        <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-xl">
          <header className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Vendas por Marcas</h2>
            <div className="h-px flex-1 bg-white/5 mx-6" />
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Share de Mercado</span>
          </header>
          <RankingMarcas
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>

        {/* RANKING LOJAS */}
        <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-xl xl:col-span-2">
          <header className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Performance por Unidade / Loja</h2>
            <div className="h-px flex-1 bg-white/5 mx-6" />
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Visão Geográfica</span>
          </header>
          <RankingLojas
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>
      </div>

    </div>
  );
}