import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Tag, Palette } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { SliderPicker } from "react-color";
import { useForm } from "react-hook-form";
import { MutationSetMeta, SetMarcaType } from "../../../graphql/Marca/Mutation";

export function MarcaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<SetMarcaType>();
  const [selectedColor, setSelectedColor] = useState("#10b981");
  
  const { FormSetMarca } = MutationSetMeta();

  const handleProductSubmit = async (data: SetMarcaType) => {
    try {
      Swal.fire({
        title: "Criando Marca",
        background: "#0d0d10",
        color: "#fff",
        didOpen: () => Swal.showLoading(),
      });

      await FormSetMarca(data);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Fabricante registrado.",
        icon: "success",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve uma falha no cadastro.",
        icon: "error",
        background: "#0d0d10",
        color: "#fff",
      });
    }
  };

  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex);
    setValue("cor", color.hex);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
          <FiPlusSquare size={20} /> Nova Marca
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-white">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <Dialog.Title className="text-xl font-bold uppercase tracking-wider">
                Configurar Marca
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleProductSubmit)} className="space-y-8">
            
            {/* Nome da Marca */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Nome Comercial</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Ex: L'Oréal, Wella..."
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className="w-full pl-14 pr-6 py-5 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                />
              </div>
              {errors.nome && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">{errors.nome.message}</p>}
            </div>

            {/* Cor da Marca */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                <Palette size={14} className="text-emerald-500" /> Identidade Visual (Cor)
              </label>
              <div className="p-6 bg-[#0a0a0c] border border-white/10 rounded-2xl space-y-6">
                <SliderPicker color={selectedColor} onChange={handleColorChange} />
                <div className="flex items-center gap-4 pt-2">
                    <div className="w-12 h-12 rounded-xl border border-white/20 shadow-inner" style={{ backgroundColor: selectedColor }} />
                    <input
                      type="text"
                      {...register("cor")}
                      value={selectedColor}
                      readOnly
                      className="flex-1 bg-white/5 border border-white/10 text-white font-mono text-center py-3 rounded-xl outline-none"
                    />
                </div>
              </div>
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
                className="flex-1 py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all"
              >
                Salvar Marca
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}