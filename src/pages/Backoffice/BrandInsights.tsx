import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  QueryMarcaInsights,
} from "../../graphql/Marca/Query";
import {
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
import { FaChartBar, FaStore, FaUsers, FaCalendarAlt, FaHistory, FaTags } from "react-icons/fa";
import { BounceLoader } from "react-spinners";

type SalesStat = {
  name: string;
  tratamento: number;
  coloracao: number;
  total: number;
};

function mapMarcaSales(items: any[], type: 'loja' | 'vendedor'): SalesStat[] {
  if (!items) return [];

  return items
    .map((item) => {
      const tratamento = item.pontos_totais_tratamento ?? 0;
      const coloracao = item.pontos_totais_coloracao ?? 0;
      const nome = type === 'loja' ? item.nome_fantasia : item.nome;

      return {
        name: nome,
        tratamento,
        coloracao,
        total: item.pontos_totais || (tratamento + coloracao),
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function BrandInsights() {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { data, loading, refetch } = QueryMarcaInsights({
    variables: {
      filters: {
        marcaId: parseInt(id!),
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
        type: "BRAND",
      },
    },
  });

  const metricas = useMemo(() => {
    const periodos = dataVendas?.GetInsightsGastosPeriodos || [];
    const dias = periodos.length;

    let totalTratamentos = 0;
    let totalColoracoes = 0;

    for (const periodo of periodos) {
      for (const cat of periodo.categories) {
        if (cat.title.toLowerCase() === "tratamentos") {
          totalTratamentos += cat.value;
        }
        if (cat.title.toLowerCase() === "colorações" || cat.title.toLowerCase() === "coloracao") {
          totalColoracoes += cat.value;
        }
      }
    }

    return {
      mediaTotal: dias > 0 ? (totalTratamentos + totalColoracoes) / dias : 0,
      mediaTratamentos: dias > 0 ? totalTratamentos / dias : 0,
      mediaColoracoes: dias > 0 ? totalColoracoes / dias : 0,
    };
  }, [dataVendas]);

  const handleDateChange = (field: "start" | "end", value: string) => {
    field === "start" ? setStartDate(value) : setEndDate(value);
  };

  const applyFilters = () => {
    if (!startDate || !endDate) return;
    const fmt = (date: string) => formatDateString(date);

    refetch({
      filters: {
        marcaId: parseInt(id!),
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
        type: "BRAND",
      },
    });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);

    refetch({
      filters: {
        marcaId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    });

    refetchVendas({
      filters: {
        targetId: parseInt(id!),
        startDate: null,
        endDate: null,
        type: "BRAND",
      },
    });
  };

  if (loading || loadingVendas) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
        <BounceLoader color="#3b82f6" size={70} />
        <span className="text-xs font-black text-gray-500 uppercase tracking-[4px]">Analisando Marca</span>
      </div>
    );
  }

  if (!data?.GetMarcaInsights?.result) {
    return (
      <div className="p-20 text-center">
        <p className="text-gray-500 text-lg uppercase tracking-widest font-bold">Marca não localizada</p>
      </div>
    );
  }

  const marca = data.GetMarcaInsights.result;
  const topStores = mapMarcaSales(marca.lojas, 'loja');
  const topSellers = mapMarcaSales(marca.vendedores, 'vendedor');

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const period = startDate && endDate
      ? `${formatDateString(startDate)} - ${formatDateString(endDate)}`
      : `${formatDateDisplay(firstDay)} - ${formatDateDisplay(lastDay)}`;

  const RankingScrollCard = ({ title, chartData, icon }: { title: string, chartData: SalesStat[], icon: any }) => {
    const maxValue = Math.max(...chartData.map((d) => d.total), 1);
    const chartHeight = Math.max(chartData.length * 45, 400);

    return (
      <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-500 border border-white/5">
                {icon}
            </div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[3px]">{title}</h2>
          </div>
          <span className="text-[10px] text-gray-600 font-bold bg-white/5 px-3 py-1 rounded-full uppercase italic">
            {chartData.length} registros
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" hide domain={[0, maxValue + 5]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                  content={<CustomTooltip />} 
                />
                <Bar dataKey="coloracao" stackId="a" fill="#1e40af" barSize={18}>
                   <LabelList dataKey="coloracao" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                </Bar>
                <Bar dataKey="tratamento" stackId="a" fill="#10b981" radius={[0, 6, 6, 0]} barSize={18}>
                  <LabelList dataKey="tratamento" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-5">
          <div className="w-1.5 h-12 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              {marca.nome}
            </h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-[2px] mt-2 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" size={14} /> Período: <span className="text-gray-200">{period}</span>
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
            <p className="text-4xl font-black text-blue-400">{marca.pontos_totais_coloracao.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <FaTags size={24} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-white/5 p-8 rounded-[32px] flex items-center justify-between shadow-xl">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[2px]">Total Tratamento</p>
            <p className="text-4xl font-black text-emerald-400">{marca.pontos_totais_tratamento.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <FaTags size={24} />
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-blue-500/20 p-8 rounded-[32px] flex items-center justify-between shadow-2xl shadow-blue-900/10">
          <div className="space-y-2">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-[2px]">Market Share Total</p>
            <p className="text-4xl font-black text-white">{marca.pontos_totais.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white">
            <FaChartBar size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RankingScrollCard title="Volume por Loja" chartData={topStores} icon={<FaStore />} />
        <RankingScrollCard title="Ranking de Vendedores" chartData={topSellers} icon={<FaUsers />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Média Diária Coloração", val: metricas.mediaColoracoes, color: "text-blue-400" },
          { label: "Média Diária Tratamentos", val: metricas.mediaTratamentos, color: "text-emerald-400" },
          { label: "Média Diária Total", val: metricas.mediaTotal, color: "text-white" }
        ].map((m, i) => (
          <div key={i} className="bg-[#0d0d10] border border-white/5 p-8 rounded-3xl text-center flex flex-col items-center justify-center shadow-lg">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-3">{m.label}</p>
            <p className={`text-3xl font-black ${m.color}`}>{m.val.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-500 border border-white/5">
                <FaHistory size={18} />
            </div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[3px]">Evolução de Vendas da Marca</h2>
          </div>
          <div className="w-full h-[450px]">
            <EarningsChart data={dataVendas!} />
          </div>
      </div>
    </div>
  );
}