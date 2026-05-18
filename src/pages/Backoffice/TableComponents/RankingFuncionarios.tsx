import React, { useState, useEffect } from "react";
import { QueryRankingFuncionarios } from "../../../graphql/Usuario/Query";
import { FaSort, FaSortUp, FaSortDown, FaUserCircle } from "react-icons/fa";
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
        quantidade: 100,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      },
    },
  });

  const [ranking, setRanking] = useState<GetRankingFuncionariosTypes["GetRankingUsuarios"]["result"]>([]);
  const [sortBy, setSortBy] = useState<"nome" | "pontos_totais">("pontos_totais");
  const [order, setOrder] = useState<"asc" | "desc" | null>("desc");
  const [originalRanking, setOriginalRanking] = useState<typeof ranking>([]);

  useEffect(() => {
    if (data?.GetRankingUsuarios?.result) {
      const filtered = data.GetRankingUsuarios.result.filter(
        (item) =>
          item.nome.toLowerCase() !== "usuARua teste".toLowerCase() &&
          item.nome.toLowerCase() !== "eduardo ramos".toLowerCase()
      );
      setRanking(filtered);
      setOriginalRanking(filtered);
    }
  }, [data]);

  if (loading) return <div className="flex justify-center p-8"><p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Carregando Ranking...</p></div>;
  if (error) return <p className="text-center p-4 text-red-500 text-xs">Erro ao carregar dados.</p>;

  const handleSort = (column: "nome" | "pontos_totais") => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("desc");
    }
  };

  const sortedRanking = [...ranking].sort((a, b) => {
    if (sortBy === "nome") {
      return order === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
    }
    return order === "asc" ? a.pontos_totais - b.pontos_totais : b.pontos_totais - a.pontos_totais;
  });

  const renderSortIcon = (column: "nome" | "pontos_totais") => {
    if (sortBy !== column) return <FaSort className="inline ml-2 opacity-20" />;
    return order === "asc" ? <FaSortUp className="inline ml-2 text-emerald-500" /> : <FaSortDown className="inline ml-2 text-emerald-500" />;
  };

  return (
    <div className="w-full">
      {/* Container com Scroll Interno */}
      <div className="relative max-h-[400px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
            <tr>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("nome")}
              >
                Colaborador {renderSortIcon("nome")}
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] text-right cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("pontos_totais")}
              >
                Performance {renderSortIcon("pontos_totais")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {sortedRanking.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <Link
                    to={`/backoffice/employee/${item.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <FaUserCircle size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                            {item.nome}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                            Ranking #{index + 1}
                        </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                    {item.pontos_totais.toLocaleString()} <span className="ml-1 text-[9px] opacity-70">pts</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer da Tabela (Opcional) */}
      <div className="mt-3 px-2 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
         <span>Total de registros: {ranking.length}</span>
         <span className="text-emerald-500/50 italic">Atualizado em tempo real</span>
      </div>
    </div>
  );
}