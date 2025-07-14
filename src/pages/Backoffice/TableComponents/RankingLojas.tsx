import React, { useState, useEffect } from "react";
import { QueryRankingLojas } from "../../../graphql/Loja/Query";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { TypesRankingLojasTypes } from "../../../graphql/Loja/Types";
import { Link } from "react-router-dom";

interface RankingProps {
  startDate?: string | null;
  endDate?: string | null;
}

export function RankingLojas({ startDate, endDate }: RankingProps) {
  const { data, error, loading } = QueryRankingLojas({
    variables: {
      filters: {
        pagina: 0,
        quantidade: 40,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      },
    },
  });

  const [ranking, setRanking] = useState<
    TypesRankingLojasTypes["getStoresInsights"]["result"]
  >([]);
  const [sortBy, setSortBy] = useState<"nome" | "pontos_totais">(
    "pontos_totais"
  ); // valor inicial
  const [order, setOrder] = useState<"asc" | "desc">("desc"); // ordem padrão: decrescente
  const [originalRanking, setOriginalRanking] = useState<typeof ranking>([]);

  useEffect(() => {
    if (data?.getStoresInsights?.result) {
      setRanking(data.getStoresInsights.result);
      setOriginalRanking(data.getStoresInsights.result);
    }
  }, [data]);

  if (loading) return <p className="text-center p-4">Carregando...</p>;
  if (error)
    return (
      <p className="text-center p-4 text-red-500">Erro ao carregar ranking.</p>
    );
  if (!ranking.length)
    return <p className="text-center p-4">Nenhum dado disponível.</p>;

  const sortedRanking = (() => {
    if (!sortBy) return originalRanking;

    return [...ranking].sort((a, b) => {
      if (sortBy === "nome") {
        return order === "asc"
          ? a.nome.localeCompare(b.nome)
          : b.nome.localeCompare(a.nome);
      }
      return order === "asc"
        ? a.total_vendas - b.total_vendas
        : b.total_vendas - a.total_vendas;
    });
  })();

  const handleSort = (column: "nome" | "pontos_totais") => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("desc"); // sempre começa decrescente ao mudar de coluna
    }
  };

  const renderSortIcon = (column: "nome" | "pontos_totais") => {
    if (sortBy !== column)
      return <FaSort className="inline ml-2 text-gray-400" />;
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
            Lojas {renderSortIcon("nome")}
          </th>
          <th
            className="border p-2 text-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort("pontos_totais")}
          >
            Pontos {renderSortIcon("pontos_totais")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedRanking.map((item) => (
          <tr key={item.id}>
            <td className="border p-2 text-center">
              <Link
                to={`/backoffice/store/${item.id}`}
                className="hover:underline"
              >
                {item.nome}
              </Link>
            </td>
            <td className="border p-2 text-center">{item.total_vendas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
