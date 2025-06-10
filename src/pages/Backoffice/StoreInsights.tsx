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
} from "recharts";
import { QueryFuncionarioInsights } from "../../graphql/Usuario/Query";
import { IoIosClose } from "react-icons/io";
import { QueryLojaInsights } from "../../graphql/Loja/Query";

type SalesStat = {
  name: string;
  total: number;
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

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  function formatDateString(dateStr: string) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

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

  const applyFilters = () => {
    if (startDate && endDate) {
      refetch({
        filters: {
          userId: parseInt(id!),
          pagina: 0,
          quantidade: 10,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
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
  if (!data || !data.GetLojaInsights?.result)
    return <p>Funcionário não encontrado</p>;

  const employee = data.GetLojaInsights.result;
  const faturamentoTotal = employee.pontos_totais;

  const topStores: SalesStat[] = [...employee.vendedores]
    .map((loja) => ({
      name: loja.nome,
      total: loja.quantidade,
    }))
    .sort((a, b) => b.total - a.total);

  const topBrands: SalesStat[] = [...employee.marca]
    .map((marca) => ({
      name: marca.nome,
      total: marca.quantidade,
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
    <div className="max-w-[1500px] px-6 mt-8 m-auto">
      <div className="w-full flex flex-col justify-between items-center md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold mb-4">
          {employee.nome_fantasia} - {period}
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

      <div>
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-3xl">Estatísticas</h1>
          <p className="text-2xl font-semibold">
            Total produtos vendidos:{" "}
            <span className="text-purple-500">{faturamentoTotal}</span>
          </p>
          
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <Tooltip />
                <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
