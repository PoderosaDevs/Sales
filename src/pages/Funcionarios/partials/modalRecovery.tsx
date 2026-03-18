import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Key, ShieldCheck } from "phosphor-react";
import { FaLock } from "react-icons/fa";
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

  // Seta o id na abertura do modal (Mantendo sua lógica original)
  useEffect(() => {
    if (isOpen && id) {
      setValue("recoveryUsuarioId", Number(id));
    }
  }, [isOpen, id, setValue]);

  // Configuração de feedback visual Dark
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Criptografando...",
        background: "#0d0d10",
        color: "#fff",
        didOpen: () => Swal.showLoading(),
      });
    }
  }, [loading]);

  const onSubmit = async (data: any) => {
    const swalConfig = {
      background: "#0d0d10",
      color: "#fff",
      confirmButtonColor: "#10b981",
    };

    try {
      const result = await FormSetRecovery(data);
      setIsOpen(false);

      if (!result) {
        Swal.fire({ ...swalConfig, title: "Erro!", text: "Ocorreu um erro durante a execução.", icon: "error" });
      } else {
        Swal.fire({ ...swalConfig, title: "Sucesso!", text: "Credenciais atualizadas.", icon: "success" });
      }
    } catch (error) {
      Swal.fire({ ...swalConfig, title: "Erro!", text: "Falha ao redefinir a senha.", icon: "error" });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {/* Botão de ação na tabela padronizado */}
        <button className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all duration-300" title="Redefinir Senha">
          <FaLock size={16} />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              <Dialog.Title className="text-xl font-bold text-white uppercase tracking-wider">
                Segurança
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </Dialog.Close>
          </div>

          <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
             <ShieldCheck size={20} className="text-emerald-500 mt-0.5" />
             <p className="text-gray-400 text-xs leading-relaxed">
               Você está alterando as credenciais de acesso do colaborador. Certifique-se de comunicar a nova senha ao usuário.
             </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-3">
              <label htmlFor="senha" className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                Nova Senha de Acesso
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={22} />
                <input
                  id="senha"
                  type="password"
                  {...register("senha")}
                  className="w-full pl-14 pr-6 py-5 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-gray-700"
                  placeholder="Defina o novo segredo"
                  required
                />
              </div>
              {errors.senha && (
                <span className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">
                  {errors.senha.message?.toString()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[3px] rounded-2xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
              >
                Confirmar Nova Senha
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="w-full py-4 text-gray-500 font-bold text-[10px] uppercase tracking-[2px] hover:text-white transition-all"
                >
                  Cancelar Operação
                </button>
              </Dialog.Close>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}