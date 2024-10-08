import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Image as ImageIcon,
  PencilSimple as PencilSimpleIcon,
  X,
} from "phosphor-react";
import { SetMarcaFieldsFormInputs } from "../../../graphql/Marca/Validations";
import { FiPlusSquare } from "react-icons/fi";
import {QueryGetProdutos} from "../../../graphql/Produto/Query"
import { MutationSetMeta } from "../../../graphql/Marca/Mutation";
export function MarcaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // Controle da etapa
  const {
    errors,
    handleSubmit,
    loading,
    register,
    reset,
    FormSetMarca,
    isSubmitting
  } = MutationSetMeta();

  const paginacao = { pagina: 1, quantidade: 10 };
  const { data, loading: loadingProdutos , error } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleProductSubmit = async (data: SetMarcaFieldsFormInputs) => {
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

            <form
              onSubmit={handleSubmit(handleProductSubmit)}
              className="space-y-6"
            >
              {step === 1 && (
                <>
                  <div className="flex items-center space-x-4">
                    <PencilSimpleIcon size={24} className="text-gray-500" />
                    <input
                      type="text"
                      placeholder="Nome da Marca"
                      {...register("stepOne.nome")}
                      className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                    />
                    {errors.stepOne?.nome && (
                      <p className="text-red-500 text-sm">
                        {errors.stepOne.nome.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <ImageIcon size={24} className="text-gray-500" />
                    <input
                      type="text"
                      placeholder="URL da Imagem da Marca"
                      {...register("stepOne.imagem")}
                      className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                    />
                    {errors.stepOne?.imagem && (
                      <p className="text-red-500 text-sm">
                        {errors.stepOne.imagem.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Próximo
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Produtos Associados
                  </h2>
                  <div className="flex items-center space-x-4">
                    <PencilSimpleIcon size={24} className="text-gray-500" />
                    <input
                      type="text"
                      placeholder="Nome do Produto"
                      {...register("stepOne.nome")}
                      className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                    />
                    {errors.stepOne?.nome && (
                      <p className="text-red-500 text-sm">
                        {errors.stepOne.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full flex justify-between">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-600 transition duration-200"
                    >
                      Salvar
                    </button>
                  </div>
                </>
              )}
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
