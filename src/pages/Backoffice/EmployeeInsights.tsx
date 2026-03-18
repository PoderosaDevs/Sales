import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  QueryFuncionarioInsights,
  QueryGetInsightsVendasPeriodos,
} from "../../graphql/Usuario/Query";
import { EarningsChart } from "./ChartComponents/LineChart";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from "recharts";
import {
  CustomTooltip,
  DateFilter,
  formatDateString,
  formatDateDisplay,
} from "./utils";
import { useMetricasVendas } from "./ChartComponents/useMetricas";
import { FaChartBar, FaAward, FaCalendarAlt, FaHistory } from "react-icons/fa";
import { BounceLoader } from "react-spinners";

type SalesStat = {
  name: string;
  tratamento: number;
  coloracao: number;
  total: number;
};

/**
 * Mapeia marcas e lojas, calcula total e ordena do maior para o menor
 */
function mapEmployeeSales(items: any[]): SalesStat[] {
  if (!items) return [];

  return items
    .map((item) => {
      const tratamento = item.pontos_tratamento ?? 0;
      const coloracao = item.pontos_coloracao ?? 0;

      return {
        name: item.nome,
        tratamento,
        coloracao,
        total: tratamento + coloracao,
      };
    })
    .sort((a, b) => b.total - a.total); // maior para menor
}

export function EmployeeInsights() {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { data, loading, refetch } = QueryFuncionarioInsights({
    variables: {
      filters: {
        userId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    },
  });

  const {
    data: dataVendas,
    loading: loadingVendas,
    refetch: refetchVendas,
  } = QueryGetInsightsVendasPeriodos({
    variables: {
      filters: {
        userId: parseInt(id!),
        startDate: null,
        endDate: null,
      },
    },
  });

  const { mediaColoracoes, mediaTotal, mediaTratamentos } =
    useMetricasVendas(dataVendas);

  const handleDateChange = (field: "start" | "end", value: string) => {
    field === "start" ? setStartDate(value) : setEndDate(value);
  };

  const applyFilters = () => {
    if (!startDate || !endDate) return;

    const fmt = (date: string) => formatDateString(date);

    refetch({
      filters: {
        userId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: fmt(startDate),
        endDate: fmt(endDate),
      },
    });

    refetchVendas({
      filters: {
        userId: parseInt(id!),
        startDate: fmt(startDate),
        endDate: fmt(endDate),
      },
    });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);

    refetch({
      filters: {
        userId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    });

    refetchVendas({
      filters: {
        userId: parseInt(id!),
        startDate: null,
        endDate: null,
      },
    });
  };

  if (loading || loadingVendas) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <BounceLoader color="#10b981" size={60} />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[4px]">Sincronizando BI</span>
      </div>
    );
  }

  if (!data?.GetUsuariosInsights?.result) {
    return (
      <div className="p-20 text-center">
        <p className="text-gray-500 uppercase tracking-widest font-bold">Funcionário não localizado</p>
      </div>
    );
  }

  const employee = data.GetUsuariosInsights.result;

  const {
    pontos_totais,
    pontos_totais_coloracao,
    pontos_totais_tratamento,
    lojas,
    marcas,
  } = employee;

  const topStores = mapEmployeeSales(lojas);
  const topBrands = mapEmployeeSales(marcas);

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
              {employee.nome}
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1 flex items-center gap-2">
              <FaCalendarAlt className="text-emerald-500" /> Período Analisado: <span className="text-gray-300">{period}</span>
            </p>
          </div>
        </div>

        <div className="bg-[#0d0d10] p-2 border border-white/5 rounded-2xl shadow-xl">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      </div>

      {/* CARDS RESUMO (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d10] border border-white/5 p-6 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Total Coloração</p>
            <p className="text-3xl font-black text-blue-400">{pontos_totais_coloracao.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <FaAward size={20} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-white/5 p-6 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Total Tratamento</p>
            <p className="text-3xl font-black text-purple-400">{pontos_totais_tratamento.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
            <FaAward size={20} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-emerald-500/20 p-6 rounded-[32px] flex items-center justify-between shadow-2xl shadow-emerald-900/5">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[2px]">Volume Geral</p>
            <p className="text-3xl font-black text-white">{pontos_totais.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <FaChartBar size={20} />
          </div>
        </div>
      </div>

      {/* GRÁFICOS BARRAS (LOJAS + MARCAS) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[
          { title: "Top Lojas por Performance", data: topStores },
          { title: "Share por Marca Parceira", data: topBrands }
        ].map((chart, i) => {
          const maxValue = Math.max(...chart.data.map((d) => d.total));
          return (
            <div key={i} className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
                    <FaChartBar size={14} />
                </div>
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">{chart.title}</h2>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chart.data} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                  <XAxis type="number" hide domain={[0, maxValue + 10]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                  <Bar dataKey="coloracao" stackId="a" fill="#1e40af" radius={[0, 0, 0, 0]} barSize={12}>
                    <LabelList dataKey="coloracao" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                  </Bar>
                  <Bar dataKey="tratamento" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12}>
                    <LabelList dataKey="tratamento" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      {/* CARDS DE MÉDIAS DIÁRIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Média Diária Colorações", val: mediaColoracoes, color: "text-blue-400" },
          { label: "Média Diária Tratamentos", val: mediaTratamentos, color: "text-emerald-400" },
          { label: "Média Diária Total", val: mediaTotal, color: "text-white" }
        ].map((m, i) => (
          <div key={i} className="bg-[#0d0d10] border border-white/5 p-6 rounded-2xl text-center flex flex-col items-center justify-center">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[2px] mb-2">{m.label}</p>
            <p className={`text-2xl font-black ${m.color}`}>{m.val.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* GRÁFICO DE LINHA (EVOLUÇÃO) */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 shadow-2xl">
         <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
                <FaHistory size={14} />
            </div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Evolução de Ganhos no Período</h2>
         </div>
         <div className="w-full h-[400px]">
            <EarningsChart data={dataVendas!} />
         </div>
      </div>
    </div>
  );
}