import { useState } from "react";
import { FaFilter, FaUserTie, FaPalette, FaStore, FaTrophy } from "react-icons/fa6";
import { useRankingUsuarios } from "../../hooks/useUsuarios";
import { useMarcasRanking } from "../../hooks/useMarcas";
import { useLojasRanking } from "../../hooks/useLojas";
import { toApiDateParam } from "../../lib/date";
import { ManagerModules } from "./ManagerModules";
import { RankingTable } from "./RankingTable";
import { DateRangeFilter } from "./DateRangeFilter";
import { ApresentacaoMensal } from "./ApresentacaoMensal";

export function Backoffice() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [apresentacaoAberta, setApresentacaoAberta] = useState(false);

  const startDate = toApiDateParam(dataInicio);
  const endDate = toApiDateParam(dataFim);

  const { data: rankingUsuarios, isLoading: loadingUsuarios } = useRankingUsuarios(startDate, endDate);
  const { data: rankingMarcas, isLoading: loadingMarcas } = useMarcasRanking(startDate, endDate);
  const { data: rankingLojas, isLoading: loadingLojas } = useLojasRanking(startDate, endDate);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Painel de <span className="text-emerald-500 font-light">Gestão</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-white ml-5">Visão estratégica e análise de performance.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap self-start lg:self-center">
          <DateRangeFilter
            dataInicio={dataInicio}
            dataFim={dataFim}
            onChangeInicio={setDataInicio}
            onChangeFim={setDataFim}
            onClear={() => {
              setDataInicio("");
              setDataFim("");
            }}
          />
          <button
            onClick={() => setApresentacaoAberta(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-[2px] rounded-2xl transition-all shadow-lg shadow-emerald-900/20"
          >
            <FaTrophy size={14} /> Apresentação Mensal
          </button>
        </div>
      </div>

      <section className="bg-[#0d0d10] border border-white/5 p-6 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <header className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <FaFilter size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[3px]">Módulos de Gerenciamento</h2>
          </header>
          <ManagerModules />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl">
          <header className="flex items-center justify-between mb-6 md:mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Ranking de Vendedoras</h2>
            <div className="h-px flex-1 bg-white/5 mx-4 md:mx-6" />
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Top Performers</span>
          </header>
          <RankingTable
            isLoading={loadingUsuarios}
            emptyLabel="Sem vendas no período"
            emptyIcon={<FaUserTie size={40} className="text-gray-600" />}
            valueLabel="pts"
            rows={rankingUsuarios?.map((u) => ({
              id: u.id,
              nome: u.nome,
              valor: u.pontos_totais,
              tratamento: u.pontos_totais_tratamento,
              coloracao: u.pontos_totais_coloracao,
              href: `/backoffice/employee/${u.id}`,
            }))}
          />
        </div>

        <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl">
          <header className="flex items-center justify-between mb-6 md:mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Vendas por Marca</h2>
            <div className="h-px flex-1 bg-white/5 mx-4 md:mx-6" />
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Share de Mercado</span>
          </header>
          <RankingTable
            isLoading={loadingMarcas}
            emptyLabel="Sem vendas no período"
            emptyIcon={<FaPalette size={40} className="text-gray-600" />}
            valueLabel="un."
            rows={rankingMarcas?.map((m) => ({
              id: m.id,
              nome: m.nome,
              valor: m.total_vendas,
              tratamento: m.total_tratamento,
              coloracao: m.total_coloracao,
              href: `/backoffice/brand/${m.id}`,
            }))}
          />
        </div>

        <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl xl:col-span-2">
          <header className="flex items-center justify-between mb-6 md:mb-10">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px]">Performance por Unidade</h2>
            <div className="h-px flex-1 bg-white/5 mx-4 md:mx-6" />
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Visão Geral</span>
          </header>
          <RankingTable
            isLoading={loadingLojas}
            emptyLabel="Sem vendas no período"
            emptyIcon={<FaStore size={40} className="text-gray-600" />}
            valueLabel="un."
            rows={rankingLojas?.map((l) => ({
              id: l.id,
              nome: l.nome_fantasia,
              valor: l.total_vendas,
              tratamento: l.total_tratamento,
              coloracao: l.total_coloracao,
              href: `/backoffice/store/${l.id}`,
            }))}
          />
        </div>
      </div>

      {apresentacaoAberta && <ApresentacaoMensal onClose={() => setApresentacaoAberta(false)} />}
    </div>
  );
}
