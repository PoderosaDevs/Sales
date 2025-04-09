import React, { useState, useEffect } from "react";
import { QueryRankingFuncionarios } from "../../../graphql/Usuario/Query";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { GetRankingFuncionariosTypes } from "../../../graphql/Usuario/Types";
import { QueryRankingMarcas } from "../../../graphql/Marca/Query";
import { TypesRankingMarcasFields } from "../../../graphql/Marca/Types";

export function RankingMarcas() {
  const { data, error, loading } = QueryRankingMarcas({
    variables: {
      filters: {
        pagina: 0,
        quantidade: 1000,
      },
    },
  });

  const [ranking, setRanking] = useState<
  TypesRankingMarcasFields["getBrandsInsights"]["result"]
  >([]);
  const [sortBy, setSortBy] = useState<"nome" | "pontos_totais" | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [originalRanking, setOriginalRanking] = useState<typeof ranking>([]); // Guarda a ordem original

  useEffect(() => {
    if (data?.getBrandsInsights?.result) {
      setRanking(data.getBrandsInsights?.result);
      setOriginalRanking(data.getBrandsInsights?.result); // Salva a ordem original
    }
  }, [data]);

  if (loading) return <p className="text-center p-4">Carregando...</p>;
  if (error)
    return (
      <p className="text-center p-4 text-red-500">Erro ao carregar ranking.</p>
    );
  if (!ranking.length)
    return <p className="text-center p-4">Nenhum dado disponível.</p>;

  // Lógica de ordenação dinâmica
  const sortedRanking = (() => {
    if (!sortBy) return originalRanking; // Se não houver ordenação, retorna a ordem original

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

  // Alternar ordenação ao clicar no cabeçalho
  const handleSort = (column: "nome" | "pontos_totais") => {
    if (sortBy === column) {
      if (order === "asc") {
        setOrder("desc");
      } else if (order === "desc") {
        setSortBy(null); // Volta para a ordem original
        setOrder(null);
      } else {
        setOrder("asc");
      }
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  // Ícones de ordenação
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
            Usuário {renderSortIcon("nome")}
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
            <td className="border p-2 text-center">{item.nome}</td>
            <td className="border p-2 text-center">{item.total_vendas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
