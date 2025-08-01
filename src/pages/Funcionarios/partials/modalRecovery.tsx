import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FaPencilAlt } from "react-icons/fa";
import { MutationSetUsuarioRecovery } from "../../../graphql/Usuario/Mutation";

interface RecoveryModalProps {
  id: string;
}

export function RecoveryModal({ id }: RecoveryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    FormSetRecovery,
    setValue,
    loading,
    errors,
  } = MutationSetUsuarioRecovery();

  // seta o id na abertura do modal
  useEffect(() => {
    if (isOpen && id) {
      setValue("recoveryUsuarioId", Number(id));
    }
  }, [isOpen, id, setValue]);

  // loading visual
  useEffect(() => {
    if (loading) {
      Swal.fire("Enviando informações...", "");
      Swal.showLoading();
    }
  }, [loading]);

  const onSubmit = async (data: any) => {
    try {
      const result = await FormSetRecovery(data);

      setIsOpen(false);

      if (!result) {
        Swal.fire("Erro!", "Ocorreu um erro durante a execução.", "error");
      } else {
        Swal.fire("Sucesso!", "Senha redefinida com sucesso.", "success");
      }
    } catch (error) {
      Swal.fire("Erro!", "Falha ao redefinir a senha.", "error");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-4 bg-slate-900 text-white font-semibold gap-2 rounded-xl mr-2">
          <FaPencilAlt size={18} />
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
            <Dialog.Title
              id="dialog-title"
              className="text-xl font-semibold mb-4"
            >
              Redefinir Senha
            </Dialog.Title>
            <div className="border w-full mb-6" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo hidden via useEffect (não precisa renderizar input para recoveryUsuarioId) */}
              <div className="flex flex-col space-y-4">
                <label htmlFor="senha" className="block text-sm">
                  Nova Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  {...register("senha")}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Digite a nova senha"
                  required
                />
                {errors.senha && (
                  <span className="text-red-500 text-sm">
                    {errors.senha.message?.toString()}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Resetar Senha
                </button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
