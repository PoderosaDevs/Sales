import React, { useState, useEffect } from "react";
import { QueryRankingFuncionarios } from "../../../graphql/Usuario/Query";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { GetRankingFuncionariosTypes } from "../../../graphql/Usuario/Types";
import { Link } from "react-router-dom";

interface RankingProps {
  startDate?: string | null;
  endDate?: string | null;
}

export function RankingFuncionarios({ startDate, endDate }: RankingProps) {
  const { data, error, loading } = QueryRankingFuncionarios({
    variables: {
      filters: {
        pagina: 0,
        quantidade: 10,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      },
    },
  });

  const [ranking, setRanking] = useState<
    GetRankingFuncionariosTypes["GetRankingUsuarios"]["result"]
  >([]);
  const [sortBy, setSortBy] = useState<"nome" | "pontos_totais" | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [originalRanking, setOriginalRanking] = useState<typeof ranking>([]); // Guarda a ordem original

  useEffect(() => {
    if (data?.GetRankingUsuarios?.result) {
      setRanking(data.GetRankingUsuarios.result);
      setOriginalRanking(data.GetRankingUsuarios.result); // Salva a ordem original
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
        ? a.pontos_totais - b.pontos_totais
        : b.pontos_totais - a.pontos_totais;
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
            <td className="border p-2 text-center">
              <Link
                to={`/backoffice/employee/${item.id}`}
                className="hover:underline"
              >
                {item.nome}
              </Link>
            </td>
            <td className="border p-2 text-center">{item.pontos_totais}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
