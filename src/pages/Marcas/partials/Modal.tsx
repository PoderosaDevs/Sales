import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { SliderPicker } from "react-color";
import { useForm } from "react-hook-form";
import { MutationSetMeta, SetMarcaType } from "../../../graphql/Marca/Mutation";

export function MarcaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<SetMarcaType>();
  const [selectedColor, setSelectedColor] = useState("#000000");
  
  const { FormSetMarca } = MutationSetMeta();

  const handleProductSubmit = async (data: SetMarcaType) => {
    try {
      Swal.fire({
        title: "Enviando...",
        text: "Sua marca e produtos estão sendo cadastrados.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      await FormSetMarca(data);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Marca e produtos cadastrados com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao cadastrar a marca e os produtos.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex);
    setValue("cor", color.hex); // Atualiza o valor do campo "cor"
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="px-3 py-2 bg-slate-900 text-white font-semibold 
            flex items-center justify-center gap-2 rounded-lg"
        >
          <FiPlusSquare size={20} /> Nova Marca
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
            aria-labelledby="dialog-title"
          >
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-300"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            <Dialog.Title id="dialog-title" className="text-xl font-semibold mb-4">
              Cadastrar Marcas
            </Dialog.Title>
            <div className="border w-full mb-6" />

            <form onSubmit={handleSubmit(handleProductSubmit)} className="space-y-6">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Nome da Marca"
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                <p className="text-red-500 text-sm">
                  {errors.nome?.message}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="font-semibold text-gray-700">Cor da Marca</label>
                <SliderPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                />
                <input
                  type="text"
                  {...register("cor")}
                  value={selectedColor}
                  readOnly
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
              </div>

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Salvar
                </button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
