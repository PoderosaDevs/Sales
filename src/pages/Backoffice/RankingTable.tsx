import { Link } from "react-router-dom";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Loader, EmptyState } from "../../components/Loader";

interface RankingRow {
  id: number;
  nome: string;
  valor: number;
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

  const max = Math.max(...rows.map((r) => r.valor), 1);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const content = (
          <>
            <div className="flex items-center gap-4 min-w-0">
              <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-gray-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-sm truncate">{row.nome}</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${(row.valor / max) * 100}%` }} />
                </div>
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
