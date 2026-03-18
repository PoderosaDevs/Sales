import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp, IoChevronForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { QueryGetMetas } from "../../graphql/Meta/Query";
import { useAuth } from "../../context/AuthContext";

import { DateToVim } from "../../utils/dateUtils";
import MyCalendar from "../../components/calendar";
import { MetaCard } from "../Metas/partials/MetaCard";

export function Home() {
  const { usuarioData } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);

  const checkScreenSize = () => setIsVisible(window.innerWidth >= 555);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const today = new Date();
  const dataMensal = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;

  const { data: vendasData, loading: vendasLoading } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
      ...(showCalendar ? {} : { dataMensal }),
    },
    skip: !usuarioData,
  });

  const { data: metasData, loading: metasLoading, error: metasError } = QueryGetMetas({
    variables: { usuarioId: usuarioData ? parseInt(usuarioData.id) : 0 },
    skip: !usuarioData,
  });

  if (!usuarioData) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header de Boas-vindas */}
      {isVisible && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
            <h1 className="text-3xl font-light text-white tracking-tight">
              Olá, <span className="font-bold">{usuarioData.nome.split(' ')[0]}</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-3.5">Acompanhe o desempenho da sua operação hoje.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LADO ESQUERDO: VENDAS (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Mobile Iniciar Venda */}
          <Link
            to="/catalog"
            className="md:hidden flex items-center justify-between p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            <span className="font-bold uppercase tracking-widest text-xs">Nova Venda</span>
            <IoBagHandleSharp size={24} />
          </Link>

          {/* Card de Listagem de Vendas */}
          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <FaCoins className="text-emerald-500" />
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
                  Últimas vendas do mês
                </h2>
              </div>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                {showCalendar ? "Ver Lista" : "Ver Calendário"}
              </button>
            </div>

            <div className="p-6">
              {showCalendar ? (
                <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5">
                  {vendasLoading ? <div className="p-10 text-center text-gray-500">Sincronizando...</div> : <MyCalendar data={vendasData!} />}
                </div>
              ) : (
                <div className="space-y-3">
                  {vendasLoading ? (
                    <div className="py-20 text-center animate-pulse text-gray-600">Carregando dados...</div>
                  ) : vendasData?.GetVendaByUsuarioID?.length ? (
                    vendasData.GetVendaByUsuarioID.map((venda: any) => (
                      <div
                        key={venda.id}
                        className="group flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <MdSell size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{DateToVim(venda.data_venda)}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tight">Venda Confirmada</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedVenda(venda)}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <IoChevronForwardOutline size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-500 italic text-sm">Sem registros neste período.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LADO DIREITO: METAS (5 colunas) */}
        <div className="lg:col-span-5">
          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl h-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center gap-3">
              <BiSolidBarChartSquare className="text-emerald-500" />
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
                Progressão de Metas
              </h2>
            </div>
            
            <div className="p-6 flex-1 custom-scrollbar overflow-y-auto max-h-[600px]">
              {metasLoading ? (
                <div className="p-10 text-center text-gray-600">Calculando metas...</div>
              ) : metasData?.GetMetas?.length ? (
                <div className="space-y-6">
                  {metasData.GetMetas.map((meta: any) => (
                    <div key={meta.id} className="bg-white/[0.02] p-1 rounded-2xl border border-white/5">
                        <MetaCard meta={meta} onDetalhes={() => {}} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 opacity-50">
                  <BiSolidBarChartSquare size={48} />
                  <p className="text-sm uppercase tracking-widest font-bold">Sem metas ativas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Detalhes (Opcional - Pode ser refinado) */}
      {selectedVenda && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d0d10] border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Detalhes da Venda</h3>
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-1">
                  {DateToVim(selectedVenda.data_venda)}
                </p>
              </div>
              <button onClick={() => setSelectedVenda(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-400">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Produtos</p>
                <ul className="space-y-3">
                  {selectedVenda.venda_detalhe.map((d: any) => (
                    <li key={d.id} className="flex justify-between items-center text-white">
                      <span>{d.produto.nome} <span className="text-gray-500 ml-1">x{d.quantidade}</span></span>
                      <span className="font-mono text-emerald-400">+{d.pontos} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedVenda(null)}
              className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-[2px] text-[10px] transition-all"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}