import React, { useState } from "react";
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

  if (loading) return <p>Carregando dados...</p>;
  if (!data?.GetUsuariosInsights?.result)
    return <p>Funcionário não encontrado</p>;

  const employee = data.GetUsuariosInsights.result;

  const {
    pontos_totais,
    pontos_totais_coloracao,
    pontos_totais_tratamento,
    lojas,
    marcas,
  } = employee;

  // 🔥 Transformações ordenadas
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
    <div className="max-w-[1500px] px-6 mt-8 m-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {employee.nome} - {period}
        </h1>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </div>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total de Coloração</p>
          <p className="text-xl font-semibold text-blue-600">
            {pontos_totais_coloracao}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total de Tratamentos</p>
          <p className="text-xl font-semibold text-purple-600">
            {pontos_totais_tratamento}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total vendido</p>
          <p className="text-xl font-semibold text-gray-800">
            {pontos_totais}
          </p>
        </div>
      </div>

      {/* GRAFICOS LOJAS + MARCAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[{ title: "Top Lojas Vendidas", data: topStores },
          { title: "Top Marcas Vendidas", data: topBrands }].map((chart) => {

          const maxValue = Math.max(...chart.data.map((d) => d.total));

          return (
            <div key={chart.title} className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">{chart.title}</h2>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chart.data} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* 🔥 Eixo X indo até o maior valor + 10 */}
                  <XAxis type="number" domain={[0, maxValue + 10]} />

                  <YAxis
                    dataKey="name"
                    type="category"
                    width={180}
                    interval={0}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar dataKey="coloracao" stackId="a" fill="#105fb9" name="Coloração">
                    <LabelList dataKey="coloracao" position="center" fill="#fff" />
                  </Bar>

                  <Bar dataKey="tratamento" stackId="a" fill="#8b5cf6" name="Tratamento">
                    <LabelList dataKey="tratamento" position="center" fill="#fff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      {/* MÉDIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Média diária de colorações</p>
          <p className="text-xl font-semibold text-blue-600">
            {mediaColoracoes.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Média diária de tratamentos</p>
          <p className="text-xl font-semibold text-purple-600">
            {mediaTratamentos.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Média diária total</p>
          <p className="text-xl font-semibold text-gray-800">
            {mediaTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* GRAFICO LINHA */}
      <div className="w-full mt-6 pb-12">
        <EarningsChart data={dataVendas!} />
      </div>
    </div>
  );
}
