import React, { useState } from "react";
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
import { QueryFuncionarioInsights } from "../../graphql/Usuario/Query";
import { IoIosClose } from "react-icons/io";
import { EarningsChart } from "./ChartComponents/LineChart";

type SalesStat = {
  name: string;
  total: number;
  tratamento?: number;
  coloracao?: number;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total =
      (payload.find((p: any) => p.dataKey === "coloracao")?.value || 0) +
      (payload.find((p: any) => p.dataKey === "tratamento")?.value || 0);

    return (
      <div className="bg-white p-2 rounded shadow text-sm text-gray-800 border border-gray-300">
        <p>
          <strong>Total:</strong> {total}
        </p>
      </div>
    );
  }

  return null;
};

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
    if (field === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const diasNoPeriodo = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diff = Math.abs(endD.getTime() - startD.getTime());
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1); // +1 para incluir o dia final
  };

  const applyFilters = () => {
    if (startDate && endDate) {
      const formatToDDMMYYYY = (isoDate: string) => {
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
      };

      refetch({
        filters: {
          userId: parseInt(id!),
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
        userId: parseInt(id!),
        pagina: 0,
        quantidade: 10,
        startDate: null,
        endDate: null,
      },
    });
  };

  if (loading) return <p>Carregando dados...</p>;
  if (!data || !data.GetUsuariosInsights?.result)
    return <p>Funcionário não encontrado</p>;

  const employee = data.GetUsuariosInsights.result;
  const faturamentoTotal = employee.pontos_totais;
  const coloracaoTotal = employee.pontos_totais_coloracao;
  const tratamentoTotal = employee.pontos_totais_tratamento;

  const topStores: SalesStat[] = [...employee.lojas]
    .map((loja) => ({
      name: loja.nome,
      total: loja.quantidade,
      tratamento: loja.pontos_tratamento,
      coloracao: loja.pontos_coloracao,
    }))
    .sort((a, b) => b.total - a.total);

  const topBrands: SalesStat[] = [...employee.marcas]
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

  const dias =
    startDate && endDate
      ? diasNoPeriodo(startDate, endDate)
      : diasNoPeriodo(
          firstDay.toISOString().split("T")[0],
          lastDay.toISOString().split("T")[0]
        );

  const mediaColoracao = (coloracaoTotal / dias).toFixed(1);
  const mediaTratamento = (tratamentoTotal / dias).toFixed(1);
  const mediaTotal = (faturamentoTotal / dias).toFixed(1);

  const period =
    startDate && endDate
      ? `${formatDateString(startDate)} - ${formatDateString(endDate)}`
      : `${formatDateDisplay(firstDay)} - ${formatDateDisplay(lastDay)}`;

  return (
    <div className="max-w-[1500px] px-6 mt-8 m-auto">
      <div className="w-full flex flex-col justify-between items-center md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold mb-4">
          {employee.nome} - {period}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              value={endDate ?? ""}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {startDate && endDate && (
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Aplicar
            </button>
          )}

          {(startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center p-2 bg-red-500 text-white rounded hover:bg-red-600"
              title="Limpar filtros"
            >
              <IoIosClose size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-2">{employee.email}</p>

      <div>
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-3xl">Estatísticas</h1>

          <p className="text-2xl font-semibold">
            Total de colorações:{" "}
            <span className="text-purple-500">{coloracaoTotal}</span>
          </p>
          <p className="text-2xl font-semibold">
            Total de tratamentos:{" "}
            <span className="text-purple-500">{tratamentoTotal}</span>
          </p>
          <p className="text-2xl font-semibold">
            Total produtos vendidos:{" "}
            <span className="text-purple-500">{faturamentoTotal}</span>
          </p>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lojas */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Top Lojas Vendidas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topStores}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="coloracao"
                  stackId="a"
                  fill="#105fb9"
                  name="Coloração"
                >
                  <LabelList
                    dataKey="coloracao"
                    position="center"
                    fill="#fff"
                    fontSize={18}
                  />
                </Bar>
                <Bar
                  dataKey="tratamento"
                  stackId="a"
                  fill="#8b5cf6"
                  name="Tratamento"
                >
                  <LabelList
                    dataKey="tratamento"
                    position="center"
                    fill="#fff"
                    fontSize={18}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Marcas */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Top Marcas Vendidas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topBrands}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="coloracao"
                  stackId="a"
                  fill="#105fb9"
                  name="Coloração"
                >
                  <LabelList
                    dataKey="coloracao"
                    position="center"
                    fill="#fff"
                    fontSize={18}
                  />
                </Bar>
                <Bar
                  dataKey="tratamento"
                  stackId="a"
                  fill="#8b5cf6"
                  name="Tratamento"
                >
                  <LabelList
                    dataKey="tratamento"
                    position="center"
                    fill="#fff"
                    fontSize={18}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <p className="text-gray-500 text-sm">Média diária de colorações</p>
            <p className="text-xl font-semibold text-blue-600">
              {mediaColoracao}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <p className="text-gray-500 text-sm">Média diária de tratamentos</p>
            <p className="text-xl font-semibold text-purple-600">
              {mediaTratamento}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <p className="text-gray-500 text-sm">Média diária total</p>
            <p className="text-xl font-semibold text-gray-800">{mediaTotal}</p>
          </div>
        </div>

        <div className="w-full mt-6">
          <EarningsChart />
        </div>
      </div>
    </div>
  );
}
