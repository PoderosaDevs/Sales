import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, Package, CaretDown, CaretUp } from "phosphor-react";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { formatDateToString } from "../../utils/dateUtils";
import { MutationDeleteVenda } from "../../graphql/Venda/Mutation";
import Swal from "sweetalert2";
import { BounceLoader } from "react-spinners";

interface Props {
  idUser: string;
}

export function VendasUsuarioModal({ idUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, loading, error } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: parseInt(idUser),
    },
  });

  const vendas = Array.isArray(data?.GetVendaByUsuarioID)
    ? data.GetVendaByUsuarioID
    : [];

  const filteredVendas = vendas.filter((venda) => {
    const vendaDate = new Date(venda.data_venda);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) return vendaDate >= start && vendaDate <= end;
    if (start) return vendaDate >= start;
    if (end) return vendaDate <= end;
    return true;
  });

  const handleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const { FormDeleteVenda } = MutationDeleteVenda(parseInt(idUser));

  // Configuração de cores para o SweetAlert2 Dark
  const swalConfig = {
    background: "#0d0d10",
    color: "#fff",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#1f1f23",
  };

  async function confirmDelete(id: number) {
    setIsOpen(false);

    setTimeout(async () => {
      const confirm = await Swal.fire({
        ...swalConfig,
        title: "Excluir Registro?",
        text: "Esta venda será removida permanentemente do histórico.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        showCloseButton: true,
      });

      if (confirm.isConfirmed) {
        try {
          Swal.fire({
            title: "Removendo...",
            background: "#0d0d10",
            color: "#fff",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          const result = await FormDeleteVenda(id);

          if (!result) {
            Swal.fire({ ...swalConfig, title: "Erro!", text: "Falha ao excluir o registro.", icon: "error" });
          } else {
            Swal.fire({ ...swalConfig, title: "Sucesso!", text: "Venda excluída com sucesso.", icon: "success" });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({ ...swalConfig, title: "Erro!", text: "Ocorreu um erro inesperado.", icon: "error" });
        }
      } else {
        setIsOpen(true);
      }
    }, 150);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all duration-300 border border-white/5" title="Ver Histórico de Vendas">
          <TbReportAnalytics size={20} />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] animate-in fade-in duration-300" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[600]">
          <Dialog.Content
            className="bg-[#0d0d10] border border-white/10 rounded-[40px] p-8 w-full max-w-[1000px] max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] outline-none"
            aria-labelledby="dialog-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                <Dialog.Title id="dialog-title" className="text-xl font-bold text-white uppercase tracking-wider">
                  Histórico de Vendas
                </Dialog.Title>
              </div>
              <button
                className="text-gray-500 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Filtros de Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-[#0a0a0c] p-5 rounded-3xl border border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-emerald-500" /> Data Inicial
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d10] border border-white/10 rounded-xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-emerald-500" /> Data Final
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d10] border border-white/10 rounded-xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Tabela */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#0d0d10] z-10">
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Código ID</th>
                    <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Data do Registro</th>
                    <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-center">Score Total</th>
                    <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-right">Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center"><BounceLoader color="#10b981" size={40} className="mx-auto" /></td>
                    </tr>
                  ) : filteredVendas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-600 uppercase text-[10px] font-bold tracking-widest italic">Nenhuma movimentação encontrada</td>
                    </tr>
                  ) : (
                    filteredVendas.map((venda) => (
                      <React.Fragment key={venda.id}>
                        <tr className={`group transition-colors ${expandedRow === venda.id ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                          <td className="py-4 px-4 font-mono text-emerald-500 font-bold text-sm">#{venda.id}</td>
                          <td className="py-4 px-4 text-gray-300 font-medium">{formatDateToString(venda.data_venda)}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg font-black text-xs">
                                {venda.pontos_totais} pts
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleExpand(venda.id)}
                                    className={`p-2.5 rounded-xl transition-all ${expandedRow === venda.id ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <FaBoxesStacked size={16} />
                                </button>
                                <button
                                    onClick={() => confirmDelete(venda.id)}
                                    className="p-2.5 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <FaTrashAlt size={16} />
                                </button>
                            </div>
                          </td>
                        </tr>

                        {/* Detalhes Expandidos */}
                        {expandedRow === venda.id && (
                          <tr>
                            <td colSpan={4} className="p-0 bg-[#0a0a0c]">
                              <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                    <Package size={18} weight="bold" />
                                    <span className="text-[10px] font-black uppercase tracking-[2px]">Itens do Pedido</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {venda.venda_detalhe.map((detail, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-4 p-3 bg-[#0d0d10] border border-white/5 rounded-2xl group/item hover:border-emerald-500/30 transition-all"
                                    >
                                      <img
                                        src={detail.produto.imagem}
                                        alt={detail.produto.nome}
                                        className="w-14 h-14 object-cover rounded-xl border border-white/10"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{detail.produto.nome}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Qtd: {detail.quantidade}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">{detail.pontos} pts/un</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer Informativo */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-gray-600 uppercase tracking-[2px]">
                <span>Processando ID de Usuário: {idUser}</span>
                <span className="text-emerald-500/50 italic">Fim do registro</span>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}