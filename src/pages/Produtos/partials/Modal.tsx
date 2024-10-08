import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Image as ImageIcon,
  Barcode as BarcodeIcon,
  PencilSimple as PencilSimpleIcon,
  Tag as TagIcon,
  Coins as Coins ,
  X,
} from "phosphor-react";
import { MutationSetProduto } from "../../../graphql/Produto/Mutation";
import { SetProdutoFieldsFormInputs } from "../../../graphql/Produto/Validations";
import { FiPlusSquare } from "react-icons/fi";

export function ProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    FormProduto,
    errors,
    handleSubmit,
    isSubmitting,
    loading,
    register,
    reset,
  } = MutationSetProduto();

  const handleProductSubmit = async (data: SetProdutoFieldsFormInputs) => {
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

      await FormProduto(data);
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
          className="px-4 py-3 bg-slate-900 text-white font-semibold 
            flex items-center justify-center gap-2 rounded-xl"
        >
          <FiPlusSquare size={20} /> Novo Produto
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content 
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
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
              Cadastrar Produto
            </Dialog.Title>
            <div className="border w-full mb-6" />
            <form
              onSubmit={handleSubmit(handleProductSubmit)}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4">
                <BarcodeIcon size={24} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Código"
                  {...register("codigo")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.codigo && (
                  <p className="text-red-500 text-sm">
                    {errors.codigo.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <PencilSimpleIcon size={24} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Nome"
                  {...register("nome")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm">{errors.nome.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <TagIcon size={24} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Descrição"
                  {...register("descricao")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Coins  size={24} className="text-gray-500" />
                <input
                  type="number"
                  placeholder="Pontos"
                  {...register("pontos", { valueAsNumber: true })}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.pontos && (
                  <p className="text-red-500 text-sm">{errors.pontos.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <ImageIcon size={24} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Imagem"
                  {...register("imagem")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                {errors.imagem && (
                  <p className="text-red-500 text-sm">
                    {errors.imagem.message}
                  </p>
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
