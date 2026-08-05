import { Link } from "react-router-dom";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Loader, EmptyState } from "../../components/Loader";

interface RankingRow {
  id: number;
  nome: string;
  valor: number;
  tratamento?: number;
  coloracao?: number;
  href?: string;
}

export function RankingTable({
  rows,
  isLoading,
  emptyLabel,
  emptyIcon,
  valueLabel,
}: {
  rows?: RankingRow[];
  isLoading: boolean;
  emptyLabel: string;
  emptyIcon: React.ReactNode;
  valueLabel: string;
}) {
  if (isLoading) return <Loader label="Sincronizando..." />;
  if (!rows?.length) return <EmptyState title={emptyLabel} icon={emptyIcon} />;

  return (
    <div className="space-y-2">
      {rows.map((row, index) => {
        const content = (
          <>
            <div className="flex items-center gap-4 min-w-0">
              <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-gray-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-sm truncate">{row.nome}</p>
                {(row.tratamento !== undefined || row.coloracao !== undefined) && (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold whitespace-nowrap">
                      Tratamento {row.tratamento ?? 0}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold whitespace-nowrap">
                      Coloração {row.coloracao ?? 0}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <span className="text-emerald-500 font-bold text-sm font-mono">
                {row.valor} <span className="text-gray-600 text-[10px] font-sans">{valueLabel}</span>
              </span>
              {row.href && <IoChevronForwardOutline className="text-gray-600" size={16} />}
            </div>
          </>
        );

        return row.href ? (
          <Link key={row.id} to={row.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
            {content}
          </Link>
        ) : (
          <div key={row.id} className="flex items-center justify-between p-3">
            {content}
          </div>
        );
      })}
    </div>
  );
}
