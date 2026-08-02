import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaStream } from "react-icons/fa";
import { useLinhas, useCreateLinha, useUpdateLinha, useDeleteLinha } from "../../hooks/useLinhas";
import { useMarcas } from "../../hooks/useMarcas";
import { Button } from "../../components/ui/button";
import { Input, Label, Select, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { extractErrorMessage } from "../../lib/api";
import { Linha } from "../../types";

const schema = z.object({
  nome: z.string().min(1, "Informe o nome da linha."),
  marcaId: z.coerce.number().min(1, "Selecione uma marca."),
});
type FormData = z.infer<typeof schema>;

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function Linhas() {
  const { data: linhas, isLoading } = useLinhas();
  const { data: marcas } = useMarcas();
  const createLinha = useCreateLinha();
  const updateLinha = useUpdateLinha();
  const deleteLinha = useDeleteLinha();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Linha | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditing(null);
    reset({ nome: "", marcaId: undefined });
    setIsOpen(true);
  };

  const openEdit = (linha: Linha) => {
    setEditing(linha);
    reset({ nome: linha.nome, marcaId: linha.marcaId });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateLinha.mutateAsync({ id: editing.id, nome: data.nome });
      } else {
        await createLinha.mutateAsync(data);
      }
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Linha salva." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = (linha: Linha) => {
    Swal.fire({
      ...swalConfig,
      title: "Remover linha?",
      text: `"${linha.nome}" será removida.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteLinha.mutateAsync(linha.id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Linhas</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Nova Linha
        </Button>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Sincronizando..." />
        ) : !linhas?.length ? (
          <EmptyState title="Nenhuma linha cadastrada" icon={<FaStream size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {linhas.map((linha) => (
              <div key={linha.id} className="flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors">
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{linha.nome}</p>
                  {linha.marca && (
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: linha.marca.cor }} />
                      {linha.marca.nome}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(linha)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                    <FaPencilAlt size={13} />
                  </button>
                  <button onClick={() => confirmDelete(linha)} className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editing ? "Editar Linha" : "Nova Linha"} maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da linha</Label>
            <Input id="nome" placeholder="Ex: Profissional, Home Care..." {...register("nome")} />
            <FieldError>{errors.nome?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marcaId">Marca</Label>
            <Select id="marcaId" disabled={!!editing} {...register("marcaId")}>
              <option value="">Selecione...</option>
              {marcas?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </Select>
            {editing && <p className="text-[11px] text-gray-500 ml-1">A marca de uma linha não pode ser alterada depois de criada.</p>}
            <FieldError>{errors.marcaId?.message}</FieldError>
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
