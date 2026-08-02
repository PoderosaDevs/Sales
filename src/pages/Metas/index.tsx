import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaPlus, FaTrashAlt, FaBullseye, FaLayerGroup } from "react-icons/fa";
import { useMetasTodas, useCreateMeta, useDeleteMeta } from "../../hooks/useMetas";
import { useMarcas } from "../../hooks/useMarcas";
import { useUsuarios } from "../../hooks/useUsuarios";
import { Button } from "../../components/ui/button";
import { Input, Label, Select, Textarea, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { extractErrorMessage } from "../../lib/api";
import { TipoPessoa, MetaSituacao } from "../../types";
import { MetaCard } from "./MetaCard";

const situacaoConfig: Record<MetaSituacao, { label: string; className: string }> = {
  [MetaSituacao.PENDENTE]: { label: "Pendente", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  [MetaSituacao.EM_ANDAMENTO]: { label: "Em andamento", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  [MetaSituacao.CONCLUIDA]: { label: "Concluída", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  [MetaSituacao.CANCELADA]: { label: "Cancelada", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const schema = z.object({
  nome: z.string().min(1, "Informe o nome da meta."),
  marcaId: z.coerce.number().min(1, "Selecione uma marca."),
  quantidade_objetivo: z.coerce.number().int().positive("Informe uma quantidade válida."),
  data_inicio: z.string().min(1, "Informe a data de início."),
  data_fim: z.string().min(1, "Informe a data de fim."),
  descricao: z.string().optional(),
  usuarioIds: z.array(z.coerce.number()).min(1, "Selecione ao menos uma vendedora."),
  etapas: z.array(z.object({ nome: z.string().min(1, "Nome obrigatório."), quantidade_objetivo: z.coerce.number().int().positive() })).optional(),
});
type FormData = z.infer<typeof schema>;

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function Metas() {
  const { data: metas, isLoading } = useMetasTodas();
  const { data: marcas } = useMarcas();
  const { data: vendedoras } = useUsuarios(TipoPessoa.EMPLOYEE);
  const createMeta = useCreateMeta();
  const deleteMeta = useDeleteMeta();
  const [isOpen, setIsOpen] = useState(false);
  const [todosSelecionados, setTodosSelecionados] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { usuarioIds: [], etapas: [] } });

  const { fields, append, remove } = useFieldArray({ control, name: "etapas" });

  const openCreate = () => {
    setTodosSelecionados(false);
    reset({ nome: "", marcaId: undefined, quantidade_objetivo: undefined, data_inicio: "", data_fim: "", descricao: "", usuarioIds: [], etapas: [] });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createMeta.mutateAsync({
        ...data,
        usuarioIds: todosSelecionados ? [0] : data.usuarioIds,
        etapas: data.etapas?.length ? data.etapas : undefined,
      });
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Meta criada." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = (id: number, nome: string) => {
    Swal.fire({
      ...swalConfig,
      title: "Remover meta?",
      text: `"${nome}" e suas etapas serão removidas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteMeta.mutateAsync(id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Metas</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Nova Meta
        </Button>
      </div>

      {isLoading ? (
        <Loader label="Sincronizando metas..." />
      ) : !metas?.length ? (
        <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] shadow-2xl">
          <EmptyState title="Nenhuma meta cadastrada" icon={<FaBullseye size={40} className="text-gray-600" />} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {metas.map((meta) => (
            <div key={meta.id} className="bg-[#0d0d10] border border-white/5 rounded-3xl shadow-2xl relative group">
              <button
                onClick={() => confirmDelete(meta.id, meta.nome)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <FaTrashAlt size={12} />
              </button>
              <MetaCard meta={meta} />
              {meta.usuarios && meta.usuarios.length > 0 && (
                <div className="px-4 pb-4 -mt-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">
                    {meta.usuarios.length} vendedora{meta.usuarios.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {meta.usuarios.slice(0, 4).map((u) => (
                      <span key={u.id} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-lg truncate max-w-[120px]">
                        {u.nome.split(" ")[0]}
                      </span>
                    ))}
                    {meta.usuarios.length > 4 && (
                      <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 rounded-lg">+{meta.usuarios.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
              <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${situacaoConfig[meta.situacao].className}`}>
                {situacaoConfig[meta.situacao].label}
              </span>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Nova Meta" maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da meta</Label>
              <Input id="nome" placeholder="Ex: Campanha de Coloração" {...register("nome")} />
              <FieldError>{errors.nome?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marcaId">Marca</Label>
              <Select id="marcaId" {...register("marcaId")}>
                <option value="">Selecione...</option>
                {marcas?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </Select>
              <FieldError>{errors.marcaId?.message}</FieldError>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea id="descricao" rows={2} {...register("descricao")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="quantidade_objetivo">Quantidade objetivo</Label>
              <Input id="quantidade_objetivo" type="number" {...register("quantidade_objetivo")} />
              <FieldError>{errors.quantidade_objetivo?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Início</Label>
              <Input id="data_inicio" type="date" className="[color-scheme:dark]" {...register("data_inicio")} />
              <FieldError>{errors.data_inicio?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_fim">Fim</Label>
              <Input id="data_fim" type="date" className="[color-scheme:dark]" {...register("data_fim")} />
              <FieldError>{errors.data_fim?.message}</FieldError>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Vendedoras participantes</Label>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={(e) => setTodosSelecionados(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                Todas as vendedoras
              </label>
            </div>
            {!todosSelecionados && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-3 bg-white/[0.02] border border-white/10 rounded-2xl">
                {vendedoras?.map((v) => (
                  <label key={v.id} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input type="checkbox" value={v.id} {...register("usuarioIds")} className="w-4 h-4 rounded accent-emerald-500" />
                    <span className="truncate">{v.nome}</span>
                  </label>
                ))}
              </div>
            )}
            {!todosSelecionados && <FieldError>{errors.usuarioIds?.message}</FieldError>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <FaLayerGroup size={11} /> Etapas (opcional)
              </Label>
              <button
                type="button"
                onClick={() => append({ nome: "", quantidade_objetivo: 1 })}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400"
              >
                <FaPlus size={9} /> Adicionar etapa
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input placeholder="Nome da etapa" {...register(`etapas.${index}.nome`)} />
                <Input type="number" placeholder="Qtd." className="w-28" {...register(`etapas.${index}.quantidade_objetivo`)} />
                <button type="button" onClick={() => remove(index)} className="p-3 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0">
                  <FaTrashAlt size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar meta"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
