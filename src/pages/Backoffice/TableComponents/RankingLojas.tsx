import React, { useState, useEffect } from "react";
import { QueryRankingLojas } from "../../../graphql/Loja/Query";
import { FaSort, FaSortUp, FaSortDown, FaStore } from "react-icons/fa";
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
        quantidade: 100,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      },
    },
  });

  const [ranking, setRanking] = useState<TypesRankingLojasTypes["getStoresInsights"]["result"]>([]);
  const [sortBy, setSortBy] = useState<"nome" | "total_vendas">("total_vendas");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (data?.getStoresInsights?.result) {
      setRanking(data.getStoresInsights.result);
    }
  }, [data]);

  if (loading) return (
    <div className="flex justify-center p-8">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] animate-pulse">
        Sincronizando Unidades...
      </p>
    </div>
  );

  if (error) return <p className="text-center p-4 text-red-500 text-xs font-bold uppercase">Erro de conexão.</p>;
  if (!ranking.length) return <p className="text-center p-8 text-slate-500 text-sm italic">Nenhum dado disponível para este período.</p>;

  const handleSort = (column: "nome" | "total_vendas") => {
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
    return order === "asc" ? a.total_vendas - b.total_vendas : b.total_vendas - a.total_vendas;
  });

  const renderSortIcon = (column: "nome" | "total_vendas") => {
    if (sortBy !== column) return <FaSort className="inline ml-2 opacity-20" />;
    return order === "asc" ? <FaSortUp className="inline ml-2 text-emerald-500" /> : <FaSortDown className="inline ml-2 text-emerald-500" />;
  };

  return (
    <div className="w-full">
      {/* Container com Scroll Interno e Scrollbar Customizada */}
      <div className="relative max-h-[400px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
            <tr>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("nome")}
              >
                Unidade / Loja {renderSortIcon("nome")}
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] text-right cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("total_vendas")}
              >
                Volume de Vendas {renderSortIcon("total_vendas")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedRanking.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <Link
                    to={`/backoffice/store/${item.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                      <FaStore size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {item.nome}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        Cod: #{(index + 100).toString()}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100 shadow-sm">
                    {item.total_vendas.toLocaleString()}
                    <span className="ml-1.5 text-[9px] font-bold opacity-60 uppercase">un</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Informativo */}
      <div className="mt-4 px-2 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[2px]">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sincronizado com o PDV
        </div>
        <span>{ranking.length} Lojas Ativas</span>
      </div>
    </div>
  );
}