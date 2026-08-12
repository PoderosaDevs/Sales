import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp, IoChevronForwardOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useVendasByUsuario } from "../../hooks/useVendas";
import { currentDataMensal, formatDate } from "../../lib/date";
import { Loader, EmptyState } from "../../components/Loader";
import { VendaDetalhesModal } from "./VendaDetalhesModal";
import { Venda } from "../../types";

export function Vendas() {
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const { usuario } = useAuth();
  const dataMensal = currentDataMensal();

  const { data: vendas, isLoading } = useVendasByUsuario(usuario?.id, dataMensal);

  if (!usuario) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 md:h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight truncate">Gestão de Vendas</h1>
          </div>
          <p className="text-gray-400 text-sm md:text-white ml-5">Consulte seu histórico de performance.</p>
        </div>

        <Link
          to="/catalog"
          className="flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          Nova Venda <IoBagHandleSharp size={20} />
        </Link>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-5 md:p-8 border-b border-white/5 bg-white/[0.01] flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 flex-shrink-0">
            <FaCoins size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[2px]">Relatório mensal</h2>
            <p className="text-white text-white font-medium truncate">Período: {dataMensal}</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {isLoading ? (
            <Loader label="Sincronizando..." />
          ) : !vendas?.length ? (
            <EmptyState title="Nenhum registro encontrado" icon={<MdSell size={48} className="text-gray-600" />} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {vendas.map((venda, index) => (
                <div
                  key={venda.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 md:p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#0a0a0c] border border-white/5 rounded-xl text-emerald-500">
                      <MdSell size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-white truncate">{formatDate(venda.data_venda)}</p>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">
                        {venda.loja?.nome_fantasia ?? `Registro #${index + 1}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-emerald-500 text-sm font-bold flex-shrink-0">{venda.pontos_totais} pts</span>
                    <button
                      onClick={() => setSelectedVenda(venda)}
                      className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-[#0a0a0c] border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      <span className="hidden sm:inline">Ver Detalhes</span>
                      <span className="sm:hidden">Detalhes</span>
                      <IoChevronForwardOutline size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <VendaDetalhesModal venda={selectedVenda} onOpenChange={(open) => !open && setSelectedVenda(null)} />
    </div>
  );
}
