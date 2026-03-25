import React, { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { DateToVim } from "../../utils/dateUtils";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp, IoChevronForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import MyCalendar from "../../components/calendar";
import { BounceLoader } from "react-spinners";

export function Vendas() {
  const [showCalendar, setShowCalendar] = useState(false);
  const { usuarioData } = useAuth();

  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentYear = String(today.getFullYear()).slice(-2);
  const dataMensal = `${currentMonth}/${currentYear}`;

  const { data, loading } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
      ...(showCalendar ? {} : { dataMensal }),
    },
    skip: !usuarioData,
  });

  if (!usuarioData) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestão de Vendas
            </h1>
          </div>
          <p className="text-gray-400 text-base ml-5">Consulte e gerencie seu histórico de performance.</p>
        </div>

        <Link
          to="/catalog"
          className="flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          Nova Venda <IoBagHandleSharp size={20} />
        </Link>
      </div>

      {/* PAINEL PRINCIPAL */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        
        {/* Cabeçalho do Card */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <FaCoins size={22} />
            </div>
            <div>
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[2px]">
                Relatório Mensal
              </h2>
              <p className="text-white text-base font-medium">Período: {currentMonth}/{today.getFullYear()}</p>
            </div>
          </div>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 transition-all"
          >
            {showCalendar ? "Exibir em Lista" : "Exibir Calendário"}
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="p-6 md:p-8">
          {showCalendar ? (
            <div className="bg-[#0a0a0c] p-5 rounded-2xl border border-white/5 animate-in zoom-in-95 duration-500">
              <MyCalendar controls={true} data={data!} />
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-24 space-y-6">
                  <BounceLoader color="#10b981" size={60} />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sincronizando Banco de Dados</span>
                </div>
              ) : data?.GetVendaByUsuarioID.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-30">
                   <MdSell size={56} className="text-gray-500 mb-4" />
                   <span className="text-gray-500 text-base uppercase tracking-widest font-bold">
                    Nenhum registro encontrado
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {data?.GetVendaByUsuarioID.map((venda, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 flex items-center justify-center bg-[#0a0a0c] border border-white/5 rounded-xl text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                          <MdSell size={26} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg tracking-tight">
                            {DateToVim(venda.data_venda)}
                          </p>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">
                            ID da Transação: #{(index + 1024).toString(16).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">Status</span>
                            <span className="text-emerald-500 text-sm font-bold">Confirmada</span>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-[#0a0a0c] border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                          Ver Detalhes
                          <IoChevronForwardOutline size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}