import { FaCalendarDays, FaFilter, FaXmark } from "react-icons/fa6";

interface DateRangeFilterProps {
  dataInicio: string;
  dataFim: string;
  onChangeInicio: (value: string) => void;
  onChangeFim: (value: string) => void;
  onClear: () => void;
  label?: string;
}

/**
 * Seletor de período (data início/fim) usado no painel de gestão e nas
 * páginas de desempenho por loja/vendedora/marca — permite ver os dados
 * de qualquer mês, não só o atual.
 */
export function DateRangeFilter({ dataInicio, dataFim, onChangeInicio, onChangeFim, onClear, label = "Período" }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[2px]">
        <FaFilter className="text-emerald-500" size={12} /> {label}:
      </div>
      <div className="flex items-center gap-2 bg-[#0d0d10] border border-white/10 rounded-2xl px-4 py-3">
        <FaCalendarDays className="text-emerald-500" size={14} />
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => onChangeInicio(e.target.value)}
          className="bg-transparent text-white text-xs outline-none [color-scheme:dark]"
        />
        <span className="text-gray-600">—</span>
        <input
          type="date"
          value={dataFim}
          onChange={(e) => onChangeFim(e.target.value)}
          className="bg-transparent text-white text-xs outline-none [color-scheme:dark]"
        />
      </div>
      {(dataInicio || dataFim) && (
        <button
          onClick={onClear}
          className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          title="Limpar período (volta pro mês atual)"
        >
          <FaXmark size={14} />
        </button>
      )}
    </div>
  );
}
