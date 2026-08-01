import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FaCoins, FaUser } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { DateToVim } from "../../utils/dateUtils";

interface VendaDetalheProduto {
  produto: {
    id: number;
    nome: string;
    imagem: string;
  };
  pontos: number;
  quantidade: number;
}

interface VendaDetalhesData {
  id: number;
  data_venda: string;
  pontos_totais: number;
  situacao: boolean;
  funcionario: {
    id: string;
    nome: string;
  };
  venda_detalhe: VendaDetalheProduto[];
}

interface VendaDetalhesModalProps {
  venda: VendaDetalhesData | null;
  onOpenChange: (open: boolean) => void;
}

export function VendaDetalhesModal({ venda, onOpenChange }: VendaDetalhesModalProps) {
  return (
    <Dialog.Root open={!!venda} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[32px] md:rounded-[40px] p-5 md:p-10 w-[95vw] max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          {venda && (
            <>
              {/* Header do Modal */}
              <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 bg-[#0d0d10] z-10 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                  <Dialog.Title className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                    Detalhes da Venda
                  </Dialog.Title>
                </div>
                <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} weight="bold" />
                </Dialog.Close>
              </div>

              <div className="space-y-6">
                {/* Indicadores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-1">Data</p>
                    <p className="text-white font-bold text-lg">{DateToVim(venda.data_venda)}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-emerald-500/20 p-5 rounded-2xl">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[2px] mb-1">Pontos Totais</p>
                    <p className="text-emerald-500 font-black text-lg">{venda.pontos_totais?.toLocaleString() ?? 0} pts</p>
                  </div>
                </div>

                {/* Funcionário e Status */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <FaUser size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Vendedor</p>
                      <p className="text-white font-bold text-sm">{venda.funcionario?.nome ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Status</p>
                      <p className={`font-bold text-sm ${venda.situacao ? "text-emerald-500" : "text-yellow-500"}`}>
                        {venda.situacao ? "Confirmada" : "Pendente"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de Produtos */}
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3 ml-1">
                    Produtos ({venda.venda_detalhe?.length ?? 0})
                  </p>
                  <div className="space-y-3">
                    {venda.venda_detalhe?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4"
                      >
                        {item.produto?.imagem ? (
                          <img
                            src={item.produto.imagem}
                            alt={item.produto.nome}
                            className="w-14 h-14 object-cover rounded-xl border border-white/5 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center bg-[#0a0a0c] border border-white/5 rounded-xl text-emerald-500 flex-shrink-0">
                            <MdSell size={22} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{item.produto?.nome ?? "Produto"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <FaCoins size={10} className="text-emerald-500" />
                            <span className="text-emerald-500 text-xs font-bold">{item.pontos} pts / un.</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Qtd</p>
                          <p className="text-white font-black text-sm">{item.quantidade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
