import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Storefront, PencilLine } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { MutationSetLoja } from "../../../graphql/Loja/Mutation";
import { SetLojaFieldsFormInputs } from "../../../graphql/Loja/Validations";

export function LojaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    errors,
    handleSubmit,
    isSubmitting,
    register,
    reset,
    FormSetLoja
  } = MutationSetLoja();

  const handleProductSubmit = async (data: SetLojaFieldsFormInputs) => {
    try {
      Swal.fire({
        title: "Registrando Unidade",
        background: "#0d0d10",
        color: "#fff",
        didOpen: () => Swal.showLoading(),
      });

      await FormSetLoja(data);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Unidade cadastrada no ecossistema.",
        icon: "success",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Falha ao processar o cadastro.",
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
          <FiPlusSquare size={20} /> Nova Loja
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <Dialog.Title className="text-xl font-bold text-white uppercase tracking-wider">
                Cadastrar Unidade
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleProductSubmit)} className="space-y-8">
            
            {/* Nome Fantasia */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Nome Fantasia</label>
              <div className="relative group">
                <Storefront className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Ex: Paraíso Distribuidora - Unidade Sul"
                  {...register("nome_fantasia")}
                  className="w-full pl-14 pr-6 py-5 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                />
              </div>
              {errors.nome_fantasia && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">{errors.nome_fantasia.message}</p>}
            </div>

            {/* Razão Social */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Razão Social</label>
              <div className="relative group">
                <PencilLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Ex: Razão Social Completa LTDA"
                  {...register("razao_social")}
                  className="w-full pl-14 pr-6 py-5 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                />
              </div>
              {errors.razao_social && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">{errors.razao_social.message}</p>}
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="flex-1 py-5 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-white/10 transition-all">
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Gravando..." : "Confirmar Registro"}
              </button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}