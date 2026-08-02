import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaPalette } from "react-icons/fa";
import { useMarcas, useCreateMarca, useUpdateMarca, useDeleteMarca } from "../../hooks/useMarcas";
import { Button } from "../../components/ui/button";
import { Input, Label, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { extractErrorMessage } from "../../lib/api";
import { Marca } from "../../types";

const schema = z.object({
  nome: z.string().min(1, "Informe o nome da marca."),
  cor: z.string().min(4, "Escolha uma cor."),
});
type FormData = z.infer<typeof schema>;

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function Marcas() {
  const { data: marcas, isLoading } = useMarcas();
  const createMarca = useCreateMarca();
  const updateMarca = useUpdateMarca();
  const deleteMarca = useDeleteMarca();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Marca | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { nome: "", cor: "#10b981" } });

  const cor = watch("cor");

  const openCreate = () => {
    setEditing(null);
    reset({ nome: "", cor: "#10b981" });
    setIsOpen(true);
  };

  const openEdit = (marca: Marca) => {
    setEditing(marca);
    reset({ nome: marca.nome, cor: marca.cor });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateMarca.mutateAsync({ id: editing.id, ...data });
      } else {
        await createMarca.mutateAsync(data);
      }
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Marca salva." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = (marca: Marca) => {
    Swal.fire({
      ...swalConfig,
      title: "Remover marca?",
      text: `"${marca.nome}" será desativada.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteMarca.mutateAsync(marca.id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Marcas</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Nova Marca
        </Button>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Sincronizando..." />
        ) : !marcas?.length ? (
          <EmptyState title="Nenhuma marca cadastrada" icon={<FaPalette size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {marcas.map((marca) => (
              <div key={marca.id} className="flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl border border-white/10 flex-shrink-0" style={{ backgroundColor: marca.cor }} />
                  <span className="text-white font-bold truncate">{marca.nome}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(marca)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                    <FaPencilAlt size={13} />
                  </button>
                  <button onClick={() => confirmDelete(marca)} className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editing ? "Editar Marca" : "Nova Marca"} maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome comercial</Label>
            <Input id="nome" placeholder="Ex: L'Oréal, Wella..." {...register("nome")} />
            <FieldError>{errors.nome?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Cor de identidade</Label>
            <div className="flex items-center gap-4">
              <input
                id="cor"
                type="color"
                {...register("cor")}
                className="w-14 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-sm text-gray-400">{cor}</span>
            </div>
            <FieldError>{errors.cor?.message}</FieldError>
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
