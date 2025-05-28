import React, { useState, useEffect } from "react";
import { QueryRankingMarcas } from "../../../graphql/Marca/Query";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { TypesRankingMarcasFields } from "../../../graphql/Marca/Types";

interface RankingProps {
  startDate?: string | null;
  endDate?: string | null;
}

export function RankingMarcas({ startDate, endDate }:RankingProps) {
  const { data, error, loading } = QueryRankingMarcas({
    variables: {
      filters: {
        pagina: 0,
        quantidade: 1000,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null
      },
    },
  });

  const [ranking, setRanking] = useState<
    TypesRankingMarcasFields["getBrandsInsights"]["result"]
  >([]);
  const [sortBy, setSortBy] = useState<"nome" | "pontos_totais">("pontos_totais");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (data?.getBrandsInsights?.result) {
      setRanking(data.getBrandsInsights.result);
    }
  }, [data]);

  if (loading) return <p className="text-center p-4">Carregando...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Erro ao carregar ranking.</p>;
  if (!ranking.length) return <p className="text-center p-4">Nenhum dado disponível.</p>;

  const sortedRanking = [...ranking].sort((a, b) => {
    if (sortBy === "nome") {
      return order === "asc"
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }
    return order === "asc"
      ? a.total_vendas - b.total_vendas
      : b.total_vendas - a.total_vendas;
  });

  const handleSort = (column: "nome" | "pontos_totais") => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const renderSortIcon = (column: "nome" | "pontos_totais") => {
    if (sortBy !== column) return <FaSort className="inline ml-2 text-gray-400" />;
    return order === "asc" ? (
      <FaSortUp className="inline ml-2 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-2 text-blue-500" />
    );
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-50">
          <th
            className="border p-2 text-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort("nome")}
          >
            Marca {renderSortIcon("nome")}
          </th>
          <th
            className="border p-2 text-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort("pontos_totais")}
          >
            Vendas {renderSortIcon("pontos_totais")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedRanking.map((item) => (
          <tr key={item.id}>
            <td className="border p-2 text-center">{item.nome}</td>
            <td className="border p-2 text-center">{item.total_vendas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
