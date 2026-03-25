import React, { useState, useEffect } from "react";
import { QueryRankingMarcas } from "../../../graphql/Marca/Query";
import { FaSort, FaSortUp, FaSortDown, FaTags } from "react-icons/fa";
import { TypesRankingMarcasFields } from "../../../graphql/Marca/Types";
import { Link } from "react-router-dom";

interface RankingProps {
  startDate?: string | null;
  endDate?: string | null;
}

export function RankingMarcas({ startDate, endDate }: RankingProps) {
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

  const [ranking, setRanking] = useState<TypesRankingMarcasFields["getBrandsInsights"]["result"]>([]);
  const [sortBy, setSortBy] = useState<"nome" | "total_vendas">("total_vendas");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (data?.getBrandsInsights?.result) {
      setRanking(data.getBrandsInsights.result);
    }
  }, [data]);

  if (loading) return (
    <div className="flex justify-center p-8">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] animate-pulse">
        Analisando Performance de Marcas...
      </p>
    </div>
  );

  if (error) return <p className="text-center p-4 text-red-500 text-xs font-bold uppercase tracking-widest">Falha ao sincronizar marcas.</p>;
  if (!ranking.length) return <p className="text-center p-8 text-slate-500 text-sm italic tracking-wide">Sem movimentação de marcas no período.</p>;

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
      <div className="relative max-h-[400px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
            <tr>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("nome")}
              >
                Parceiro / Marca {renderSortIcon("nome")}
              </th>
              <th
                className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[2px] text-right cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleSort("total_vendas")}
              >
                Volume Comercial {renderSortIcon("total_vendas")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedRanking.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <Link
                    to={`/backoffice/brand/${item.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-300">
                      <FaTags size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {item.nome}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        Indústria Parceira
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100 shadow-sm">
                      {item.total_vendas.toLocaleString()}
                      <span className="ml-1.5 text-[9px] font-bold opacity-60 uppercase">pts</span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 px-2 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[2px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Dados Processados
        </div>
        <span>{ranking.length} Marcas no Portfólio</span>
      </div>
    </div>
  );
}