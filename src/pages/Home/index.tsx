import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp, IoChevronForwardOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useVendasByUsuario } from "../../hooks/useVendas";
import { useMetasByUsuario } from "../../hooks/useMetas";
import { currentDataMensal, formatDate } from "../../lib/date";
import { Loader, EmptyState } from "../../components/Loader";
import { MetaCard } from "../Metas/MetaCard";
import { VendaDetalhesModal } from "../Vendas/VendaDetalhesModal";
import { Venda } from "../../types";

export function Home() {
  const { usuario } = useAuth();
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  const { data: vendas, isLoading: vendasLoading } = useVendasByUsuario(usuario?.id, currentDataMensal());
  const { data: metas, isLoading: metasLoading } = useMetasByUsuario(usuario?.id);

  if (!usuario) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-7 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Olá, <span className="font-bold">{usuario.nome.split(" ")[0]}</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base ml-4">Acompanhe o desempenho da sua operação hoje.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Link
            to="/catalog"
            className="md:hidden flex items-center justify-between p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            <span className="font-bold uppercase tracking-widest text-sm">Nova Venda</span>
            <IoBagHandleSharp size={26} />
          </Link>

          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 sm:p-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
              <FaCoins className="text-emerald-500" size={18} />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[2px]">Vendas do mês</h2>
            </div>

            <div className="p-4 sm:p-6">
              {vendasLoading ? (
                <Loader label="Carregando vendas..." />
              ) : vendas?.length ? (
                <div className="space-y-4">
                  {vendas.map((venda) => (
                    <div
                      key={venda.id}
                      className="group flex items-center justify-between p-4 sm:p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-xl text-emerald-500 flex-shrink-0">
                          <MdSell size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-bold text-white truncate">{formatDate(venda.data_venda)}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-tight font-medium">Venda confirmada</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedVenda(venda)} className="p-2 text-gray-500 hover:text-white transition-colors flex-shrink-0">
                        <IoChevronForwardOutline size={22} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem registros neste período" icon={<MdSell size={40} className="text-gray-600" />} />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl h-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 sm:p-6 border-b border-white/5 bg-white/[0.01] flex items-center gap-3">
              <BiSolidBarChartSquare className="text-emerald-500" size={20} />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[2px]">Progressão de Metas</h2>
            </div>

            <div className="p-4 sm:p-6 flex-1 custom-scrollbar overflow-y-auto max-h-[600px]">
              {metasLoading ? (
                <Loader label="Calculando metas..." />
              ) : metas?.length ? (
                <div className="space-y-6">
                  {metas.map((meta) => (
                    <div key={meta.id} className="bg-white/[0.02] p-1 rounded-2xl border border-white/5">
                      <MetaCard meta={meta} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem metas ativas" icon={<BiSolidBarChartSquare size={48} className="text-gray-600" />} />
              )}
            </div>
          </div>
        </div>
      </div>

      <VendaDetalhesModal venda={selectedVenda} onOpenChange={(open) => !open && setSelectedVenda(null)} />
    </div>
  );
}
