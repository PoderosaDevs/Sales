import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Image as ImageIcon,
  Barcode as BarcodeIcon,
  PencilSimple as PencilSimpleIcon,
  Tag as TagIcon,
  CurrencyDollar as DollarSignIcon,
  X,
} from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { FaStore } from "react-icons/fa"
import { MutationSetLoja } from "../../../graphql/Loja/Mutation";
import { SetLojaFieldsFormInputs } from "../../../graphql/Loja/Validations";

export function LinhaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    errors,
    handleSubmit,
    isSubmitting,
    loading,
    register,
    reset,
    FormSetLoja
  } = MutationSetLoja();

  const handleProductSubmit = async (data: SetLojaFieldsFormInputs) => {
    try {
      Swal.fire({
        title: "Enviando...",
        text: "Seu produto está sendo cadastrado.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      await FormSetLoja(data);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Produto cadastrado com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao cadastrar o produto.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="px-3 py-2 bg-slate-900 text-white font-semibold 
            flex items-center justify-center gap-2 rounded-lg"
        >
          <FiPlusSquare size={20} /> Nova Loja
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
              Cadastrar Loja
            </Dialog.Title>
            <div className="border w-full mb-6" />
            <form
              onSubmit={handleSubmit(handleProductSubmit)}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4">
                <FaStore  size={24} className="text-gray-500"/>
                <input
                  type="text"
                  placeholder="Nome Fantasia"
                  {...register("nome_fantasia")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.nome_fantasia && (
                  <p className="text-red-500 text-sm">
                    {errors.nome_fantasia.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <PencilSimpleIcon size={24} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Razão Social"
                  {...register("razao_social")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.razao_social && (
                  <p className="text-red-500 text-sm">{errors.razao_social.message}</p>
                )}
              </div>
          
            
              <div className="w-full flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-600 transition duration-200"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
