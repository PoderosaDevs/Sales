import { Meta, MetaSituacao } from "../../types";
import { toBrDate } from "../../lib/date";

const situacaoConfig: Record<MetaSituacao, { label: string; className: string }> = {
  [MetaSituacao.PENDENTE]: { label: "Pendente", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  [MetaSituacao.EM_ANDAMENTO]: { label: "Em andamento", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  [MetaSituacao.CONCLUIDA]: { label: "Concluída", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  [MetaSituacao.CANCELADA]: { label: "Cancelada", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function MetaCard({ meta }: { meta: Meta }) {
  const percent = meta.quantidade_objetivo > 0 ? Math.min(100, Math.round((meta.quantidade_atual / meta.quantidade_objetivo) * 100)) : 0;
  const badge = situacaoConfig[meta.situacao];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{meta.nome}</p>
          {meta.marca && (
            <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.marca.cor }} />
              {meta.marca.nome}
            </p>
          )}
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500 font-medium">
            {meta.quantidade_atual} / {meta.quantidade_objetivo}
          </span>
          <span className="text-xs font-bold text-emerald-500">{percent}%</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-600 font-medium">
        {toBrDate(meta.data_inicio)} — {toBrDate(meta.data_fim)}
      </p>

      {meta.meta_etapas?.length > 0 && (
        <div className="pt-3 border-t border-white/5 space-y-2">
          {meta.meta_etapas.map((etapa) => (
            <div key={etapa.id} className="flex items-center justify-between text-xs">
              <span className={`truncate ${etapa.atingida ? "text-emerald-500" : "text-gray-400"}`}>
                {etapa.atingida ? "✓ " : ""}
                {etapa.nome}
              </span>
              <span className="text-gray-600 font-mono flex-shrink-0 ml-2">
                {etapa.quantidade_atual}/{etapa.quantidade_objetivo}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
