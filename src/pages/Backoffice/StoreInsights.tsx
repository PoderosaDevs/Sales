import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { QueryLojaInsights } from "../../graphql/Loja/Query";
import { QueryGetInsightsVendasPeriodos } from "../../graphql/Usuario/Query";
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
import { FaChartBar, FaStore, FaCalendarAlt, FaHistory, FaTags, FaUsers } from "react-icons/fa";
import { BounceLoader } from "react-spinners";

type SalesStat = {
  name: string;
  tratamento: number;
  coloracao: number;
  total: number;
};

function mapStoreSales(items: any[]): SalesStat[] {
  if (!items) return [];
  return items
    .map((item) => {
      const tratamento = item.pontos_totais_tratamento || item.pontos_tratamento || 0;
      const coloracao = item.pontos_totais_coloracao || item.pontos_coloracao || 0;
      return {
        name: item.nome || item.nome_fantasia,
        tratamento,
        coloracao,
        total: tratamento + coloracao,
      };
    })
    .sort((a, b) => b.total - a.total);
}

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

  const {
    data: dataVendas,
    loading: loadingVendas,
    refetch: refetchVendas,
  } = QueryGetInsightsVendasPeriodos({
    variables: {
      filters: {
        targetId: parseInt(id!),
        startDate: null,
        endDate: null,
        type: "STORE",
      },
    },
  });

  const { mediaColoracoes, mediaTotal, mediaTratamentos } = useMetricasVendas(dataVendas);

  const handleDateChange = (field: "start" | "end", value: string) => {
    field === "start" ? setStartDate(value) : setEndDate(value);
  };

  const applyFilters = () => {
    if (!startDate || !endDate) return;
    const fmt = (date: string) => formatDateString(date);

    refetch({
      filters: {
        lojaId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: fmt(startDate),
        endDate: fmt(endDate),
      },
    });

    refetchVendas({
      filters: {
        targetId: parseInt(id!),
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        type: "STORE",
      },
    });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    refetch({
      filters: { lojaId: parseInt(id!), pagina: 0, quantidade: 10, startDate: null, endDate: null },
    });
    refetchVendas({
      filters: { targetId: parseInt(id!), startDate: null, endDate: null, type: "STORE" },
    });
  };

  if (loading || loadingVendas) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
        <BounceLoader color="#10b981" size={70} />
        <span className="text-xs font-black text-gray-500 uppercase tracking-[4px]">Auditando Unidade</span>
      </div>
    );
  }

  if (!data?.GetLojaInsights?.result) {
    return (
      <div className="p-20 text-center">
        <p className="text-gray-500 text-lg uppercase tracking-widest font-bold">Unidade não encontrada</p>
      </div>
    );
  }

  const store = data.GetLojaInsights.result;
  const topEmployees = mapStoreSales(store.vendedores);
  const topBrands = mapStoreSales(store.marcas);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const period = startDate && endDate
    ? `${formatDateString(startDate)} - ${formatDateString(endDate)}`
    : `${formatDateDisplay(firstDay)} - ${formatDateDisplay(lastDay)}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-5">
          <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase italic font-black">
              {store.nome_fantasia}
            </h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-[2px] mt-2 flex items-center gap-2">
              <FaCalendarAlt className="text-emerald-500" size={14} /> Período: <span className="text-gray-200">{period}</span>
            </p>
          </div>
        </div>

        <div className="bg-[#0d0d10] p-3 border border-white/5 rounded-2xl shadow-xl">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d10] border border-white/5 p-8 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[2px]">Total Coloração</p>
            <p className="text-4xl font-black text-blue-400">{store.pontos_totais_coloracao.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <FaChartBar size={24} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-white/5 p-8 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[2px]">Total Tratamento</p>
            <p className="text-4xl font-black text-emerald-400">{store.pontos_totais_tratamento.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <FaChartBar size={24} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-emerald-500/20 p-8 rounded-[32px] flex items-center justify-between shadow-2xl shadow-emerald-900/5">
          <div className="space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-[2px]">Volume Geral</p>
            <p className="text-4xl font-black text-white">{store.pontos_totais.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <FaStore size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[
          { title: "Performance de Vendedores", data: topEmployees, icon: <FaUsers size={18} /> },
          { title: "Mix de Marcas Parceiras", data: topBrands, icon: <FaTags size={18} /> },
        ].map((chart, i) => {
          const maxValue = Math.max(...chart.data.map((d) => d.total), 1);
          return (
            <div key={i} className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
                  {chart.icon}
                </div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[3px]">{chart.title}</h2>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chart.data} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                  <XAxis type="number" hide domain={[0, maxValue + 5]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<CustomTooltip />} />
                  <Bar dataKey="coloracao" stackId="a" fill="#1e40af" barSize={16}>
                    <LabelList dataKey="coloracao" position="center" fill="#fff" fontSize={11} fontWeight="bold" />
                  </Bar>
                  <Bar dataKey="tratamento" stackId="a" fill="#10b981" radius={[0, 6, 6, 0]} barSize={16}>
                    <LabelList dataKey="tratamento" position="center" fill="#fff" fontSize={11} fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Média Diária Colorações", val: mediaColoracoes, color: "text-blue-400" },
          { label: "Média Diária Tratamentos", val: mediaTratamentos, color: "text-emerald-400" },
          { label: "Média Diária Total", val: mediaTotal, color: "text-white" },
        ].map((m, i) => (
          <div key={i} className="bg-[#0d0d10] border border-white/5 p-8 rounded-3xl text-center flex flex-col items-center justify-center shadow-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[2px] mb-3">{m.label}</p>
            <p className={`text-3xl font-black ${m.color}`}>{m.val.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/5">
            <FaHistory size={18} />
          </div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[3px]">Evolução Cronológica da Unidade</h2>
        </div>
        <div className="w-full h-[450px]">
          <EarningsChart data={dataVendas!} />
        </div>
      </div>
    </div>
  );
}