import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { IoIosClose } from "react-icons/io";
import { FaStore, FaCalendarAlt, FaUsers, FaTags, FaChartLine } from "react-icons/fa";
import { QueryLojaInsights } from "../../graphql/Loja/Query";
import { BounceLoader } from "react-spinners";

type SalesStat = {
  name: string;
  total: number;
  tratamento?: number;
  coloracao?: number;
};

// Tooltip customizado para o tema Dark
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total =
      (payload.find((p: any) => p.dataKey === "coloracao")?.value || 0) +
      (payload.find((p: any) => p.dataKey === "tratamento")?.value || 0);

    return (
      <div className="bg-[#0d0d10] p-4 rounded-xl shadow-2xl border border-white/10 text-sm">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2 border-b border-white/5 pb-2">
          Resumo da Unidade
        </p>
        <div className="space-y-1">
            <p className="text-white font-medium flex justify-between gap-4">
                <span>Coloração:</span> <span className="text-blue-400">{payload.find((p: any) => p.dataKey === "coloracao")?.value || 0}</span>
            </p>
            <p className="text-white font-medium flex justify-between gap-4">
                <span>Tratamento:</span> <span className="text-emerald-400">{payload.find((p: any) => p.dataKey === "tratamento")?.value || 0}</span>
            </p>
            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Total:</span>
                <span className="text-emerald-500 font-black">{total}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export function StoreInsights() {
  const { id } = useParams<{ id: string }>();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { data, loading, refetch } = QueryLojaInsights({
    variables: {
      filters: {
        lojaId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    },
  });

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateDisplay = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  const handleDateChange = (field: "start" | "end", value: string) => {
    field === "start" ? setStartDate(value) : setEndDate(value);
  };

  const applyFilters = () => {
    if (startDate && endDate) {
      const formatToDDMMYYYY = (isoDate: string) => {
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
      };

      refetch({
        filters: {
          lojaId: parseInt(id!),
          pagina: 0,
          quantidade: 10,
          startDate: formatToDDMMYYYY(startDate),
          endDate: formatToDDMMYYYY(endDate),
        },
      });
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    refetch({
      filters: {
        lojaId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    });
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <BounceLoader color="#10b981" size={60} />
      <span className="text-[10px] font-black text-gray-600 uppercase tracking-[3px]">Auditando Unidade</span>
    </div>
  );

  if (!data || !data.GetLojaInsights?.result)
    return <div className="p-20 text-center text-gray-500 uppercase font-bold">Unidade não encontrada</div>;

  const store = data.GetLojaInsights.result;
  const faturamentoTotal = store.pontos_totais;
  const coloracaoTotal = store.pontos_totais_coloracao;
  const tratamentoTotal = store.pontos_totais_tratamento;

  const topEmployees: SalesStat[] = [...store.vendedores]
    .map((vendedor) => ({
      name: vendedor.nome,
      total: vendedor.quantidade,
      tratamento: vendedor.pontos_totais_tratamento,
      coloracao: vendedor.pontos_totais_coloracao,
    }))
    .sort((a, b) => b.total - a.total);

  const topBrands: SalesStat[] = [...store.marcas]
    .map((marca) => ({
      name: marca.nome,
      total: marca.quantidade,
      tratamento: marca.pontos_tratamento,
      coloracao: marca.pontos_coloracao,
    }))
    .sort((a, b) => b.total - a.total);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const period =
    startDate && endDate
      ? `${formatDateString(startDate)} - ${formatDateString(endDate)}`
      : `${formatDateDisplay(firstDay)} - ${formatDateDisplay(lastDay)}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* HEADER E FILTROS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {store.nome_fantasia}
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1 flex items-center gap-2">
              <FaCalendarAlt className="text-emerald-500" /> Período: <span className="text-gray-300">{period}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-[#0d0d10] p-4 border border-white/5 rounded-[24px] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-500 uppercase ml-1">Início</span>
                <input
                    type="date"
                    value={startDate ?? ""}
                    onChange={(e) => handleDateChange("start", e.target.value)}
                    className="bg-[#0a0a0c] border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500/40 [color-scheme:dark]"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-500 uppercase ml-1">Fim</span>
                <input
                    type="date"
                    value={endDate ?? ""}
                    onChange={(e) => handleDateChange("end", e.target.value)}
                    className="bg-[#0a0a0c] border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500/40 [color-scheme:dark]"
                />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 md:pt-0">
              {startDate && endDate && (
                <button
                  onClick={applyFilters}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  Filtrar
                </button>
              )}

              {(startDate || endDate) && (
                <button
                  onClick={clearFilters}
                  className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 border border-white/10 rounded-xl transition-all"
                  title="Limpar filtros"
                >
                  <IoIosClose size={20} />
                </button>
              )}
          </div>
        </div>
      </div>

      {/* KPI CARDS (RESUMO DE ESTATÍSTICAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d10] border border-white/5 p-6 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Total Colorações</p>
            <p className="text-3xl font-black text-blue-400">{coloracaoTotal.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <FaChartLine size={20} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-white/5 p-6 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Total Tratamentos</p>
            <p className="text-3xl font-black text-emerald-400">{tratamentoTotal.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <FaChartLine size={20} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-emerald-500/20 p-6 rounded-[32px] flex items-center justify-between shadow-2xl shadow-emerald-900/5">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[2px]">Volume de Saída</p>
            <p className="text-3xl font-black text-white">{faturamentoTotal.toLocaleString()} <span className="text-[10px] font-medium text-gray-500">un</span></p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500">
            <FaStore size={20} />
          </div>
        </div>
      </div>

      {/* GRÁFICOS DE INSIGHTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Gráfico Vendedores */}
        <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
                <FaUsers size={14} />
            </div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Performance de Vendedores</h2>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topEmployees} layout="vertical" margin={{ left: 0, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
              <Bar dataKey="coloracao" stackId="a" fill="#1e40af" barSize={12} radius={[0, 0, 0, 0]} />
              <Bar dataKey="tratamento" stackId="a" fill="#10b981" barSize={12} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="total" position="right" fill="#94a3b8" fontSize={10} fontWeight="black" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Marcas */}
        <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
                <FaTags size={14} />
            </div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Mix de Marcas na Unidade</h2>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topBrands} layout="vertical" margin={{ left: 0, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
              <Bar dataKey="coloracao" stackId="a" fill="#1e40af" barSize={12} radius={[0, 0, 0, 0]} />
              <Bar dataKey="tratamento" stackId="a" fill="#10b981" barSize={12} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="total" position="right" fill="#94a3b8" fontSize={10} fontWeight="black" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}