import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaStore } from "react-icons/fa";
import { useLojas, useCreateLoja, useUpdateLoja, useDeleteLoja } from "../../hooks/useLojas";
import { Button } from "../../components/ui/button";
import { Input, Label, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { extractErrorMessage } from "../../lib/api";
import { Loja } from "../../types";

const schema = z.object({
  nome_fantasia: z.string().min(1, "Informe o nome fantasia."),
  razao_social: z.string().min(1, "Informe a razão social."),
});
type FormData = z.infer<typeof schema>;

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function Lojas() {
  const { data: lojas, isLoading } = useLojas();
  const createLoja = useCreateLoja();
  const updateLoja = useUpdateLoja();
  const deleteLoja = useDeleteLoja();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Loja | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditing(null);
    reset({ nome_fantasia: "", razao_social: "" });
    setIsOpen(true);
  };

  const openEdit = (loja: Loja) => {
    setEditing(loja);
    reset({ nome_fantasia: loja.nome_fantasia, razao_social: loja.razao_social });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateLoja.mutateAsync({ id: editing.id, ...data });
      } else {
        await createLoja.mutateAsync(data);
      }
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Loja salva." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = (loja: Loja) => {
    Swal.fire({
      ...swalConfig,
      title: "Remover loja?",
      text: `"${loja.nome_fantasia}" será removida.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteLoja.mutateAsync(loja.id);
        Swal.fire({ ...swalConfig, icon: "success", title: "Removida!" });
      } catch (error) {
        Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível remover.") });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Lojas</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Nova Loja
        </Button>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Sincronizando..." />
        ) : !lojas?.length ? (
          <EmptyState title="Nenhuma loja cadastrada" icon={<FaStore size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {lojas.map((loja) => (
              <div key={loja.id} className="flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 flex-shrink-0">
                    <FaStore size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{loja.nome_fantasia}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{loja.razao_social}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(loja)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                    <FaPencilAlt size={13} />
                  </button>
                  <button onClick={() => confirmDelete(loja)} className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editing ? "Editar Loja" : "Nova Loja"} maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome_fantasia">Nome fantasia</Label>
            <Input id="nome_fantasia" placeholder="Ex: Unidade Centro" {...register("nome_fantasia")} />
            <FieldError>{errors.nome_fantasia?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razao_social">Razão social</Label>
            <Input id="razao_social" placeholder="Razão social da unidade" {...register("razao_social")} />
            <FieldError>{errors.razao_social?.message}</FieldError>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
