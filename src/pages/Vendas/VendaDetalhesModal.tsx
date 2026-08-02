import { Dialog } from "../../components/ui/dialog";
import { formatDate } from "../../lib/date";
import { Venda } from "../../types";

export function VendaDetalhesModal({
  venda,
  onOpenChange,
}: {
  venda: Venda | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!venda) return null;

  return (
    <Dialog open={!!venda} onOpenChange={onOpenChange} title="Detalhes da venda" maxWidth="max-w-lg">
      <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest -mt-4 mb-6">
        {formatDate(venda.data_venda)}
        {venda.loja ? ` · ${venda.loja.nome_fantasia}` : ""}
      </p>

      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-4">Produtos</p>
        <ul className="space-y-4">
          {venda.venda_detalhe.map((d) => (
            <li key={d.id} className="flex justify-between items-center text-white text-sm sm:text-base gap-3">
              <span className="min-w-0 truncate">
                {d.produto?.nome ?? `Produto #${d.produto_id}`}{" "}
                <span className="text-gray-500 ml-2 text-sm font-medium">x{d.quantidade}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold flex-shrink-0">+{d.pontos} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-6 px-1">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total</span>
        <span className="text-xl font-black text-emerald-500">{venda.pontos_totais} pts</span>
      </div>
    </Dialog>
  );
}
