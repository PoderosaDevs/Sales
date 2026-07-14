import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Image as ImageIcon,
  Barcode as BarcodeIcon,
  PencilSimple as PencilSimpleIcon,
  Tag as TagIcon,
  Coins as CoinsIcon,
  X,
} from "phosphor-react";
import { MutationSetProduto } from "../../../graphql/Produto/Mutation";
import { FormValues } from "../../../graphql/Produto/Validations";
import { FiPlusSquare } from "react-icons/fi";
import MarcasSelect from "./MarcasSelect";

export function ProductModal() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    FormProduto,
    errors,
    handleSubmit,
    isSubmitting,
    register,
    reset,
    setValue,
  } = MutationSetProduto();

  const handleProductSubmit = async (data: FormValues) => {
    try {
      Swal.fire({
        title: "Registrando Ativo",
        background: "#0d0d10",
        color: "#fff",
        didOpen: () => Swal.showLoading(),
      });

      await FormProduto(data);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Produto integrado ao catálogo.",
        icon: "success",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve uma falha no processamento.",
        icon: "error",
        background: "#0d0d10",
        color: "#fff",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
          <FiPlusSquare size={20} /> Novo Produto
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          {/* Header do Modal */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#0d0d10] z-10 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              <Dialog.Title className="text-xl font-bold text-white uppercase tracking-wider">
                Configurar Produto
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleProductSubmit)} className="space-y-6">
            
            {/* Grid: Código e Pontos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Código SKU</label>
                    <div className="relative group">
                        <BarcodeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="Ex: REF-000" 
                          {...register("codigo")} 
                          className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm" 
                        />
                    </div>
                    {errors.codigo && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.codigo.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Pontuação</label>
                    <div className="relative group">
                        <CoinsIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                          type="number" 
                          placeholder="0" 
                          {...register("pontos", { valueAsNumber: true })} 
                          className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm" 
                        />
                    </div>
                    {errors.pontos && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.pontos.message}</p>}
                </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Nome do Produto</label>
              <div className="relative group">
                <PencilSimpleIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Nome comercial do produto" 
                  {...register("nome")} 
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm" 
                />
              </div>
              {errors.nome && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.nome.message}</p>}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Descrição Técnica</label>
              <div className="relative group">
                <TagIcon className="absolute left-4 top-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <textarea 
                  rows={3} 
                  placeholder="Detalhes adicionais do produto..." 
                  {...register("descricao")} 
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm resize-none" 
                />
              </div>
              {errors.descricao && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.descricao.message}</p>}
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Fabricante / Marca</label>
              <MarcasSelect onChange={(id) => setValue("id_marca", Number(id), { shouldValidate: true })} />
              {errors.id_marca && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.id_marca.message}</p>}
            </div>

            {/* URL Imagem */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">URL da Imagem</label>
              <div className="relative group">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="https://exemplo.com/foto.jpg" 
                  {...register("imagem")} 
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm" 
                />
              </div>
              {errors.imagem && <p className="text-red-500 text-[9px] font-bold uppercase ml-1 italic">{errors.imagem.message}</p>}
            </div>

            {/* Rodapé de Ações */}
            <div className="flex gap-4 pt-6 border-t border-white/5">
              <Dialog.Close asChild>
                <button type="button" className="flex-1 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-white/10 transition-all">
                  Descartar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Gravando..." : "Salvar Produto"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}