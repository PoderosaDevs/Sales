import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaBoxOpen, FaFilter } from "react-icons/fa";
import { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from "../../hooks/useProdutos";
import { useMarcas } from "../../hooks/useMarcas";
import { Button } from "../../components/ui/button";
import { Input, Label, Select, Textarea, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { Pagination } from "../../components/Pagination";
import { CategoriasManager } from "./CategoriasManager";
import { extractErrorMessage } from "../../lib/api";
import { Produto } from "../../types";

const numberOptional = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.coerce.number().optional()
);

const schema = z.object({
  codigo: z.string().min(1, "Informe o código SKU."),
  nome: z.string().min(1, "Informe o nome do produto."),
  descricao: z.string().optional(),
  id_marca: numberOptional,
  preco: numberOptional,
  pontos: numberOptional,
  situacao: z.boolean(),
  imagem: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function Produtos() {
  const [pagina, setPagina] = useState(0);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  const { data, isLoading } = useProdutos({
    nome: filtroNome || undefined,
    marca: filtroMarca || undefined,
    pagina,
    quantidade: 20,
  });
  const { data: marcas } = useMarcas();
  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const deleteProduto = useDeleteProduto();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { situacao: true } });

  useEffect(() => setPagina(0), [filtroNome, filtroMarca]);

  const openCreate = () => {
    setEditing(null);
    setCategoriasSelecionadas([]);
    reset({ codigo: "", nome: "", descricao: "", id_marca: undefined, preco: undefined, pontos: undefined, situacao: true, imagem: "" });
    setIsOpen(true);
  };

  const openEdit = (produto: Produto) => {
    setEditing(produto);
    setCategoriasSelecionadas(produto.categorias?.map((c) => c.nome) ?? []);
    reset({
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      id_marca: produto.id_marca ?? undefined,
      preco: produto.preco ?? undefined,
      pontos: produto.pontos ?? undefined,
      situacao: produto.situacao,
      imagem: produto.imagem ?? "",
    });
    setIsOpen(true);
  };

  const toggleCategoria = (nome: string) => {
    setCategoriasSelecionadas((prev) => (prev.includes(nome) ? prev.filter((c) => c !== nome) : [...prev, nome]));
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, categorias: categoriasSelecionadas.map((nome) => ({ nome })) };
    try {
      if (editing) {
        await updateProduto.mutateAsync({ id: editing.id, ...payload });
      } else {
        await createProduto.mutateAsync(payload);
      }
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Produto salvo." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = (produto: Produto) => {
    Swal.fire({
      ...swalConfig,
      title: "Remover produto?",
      text: `"${produto.nome}" sairá do catálogo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteProduto.mutateAsync(produto.id);
        Swal.fire({ ...swalConfig, icon: "success", title: "Removido!" });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Produtos</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Novo Produto
        </Button>
      </div>

      <div className="bg-[#0d0d10] border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[2px] flex-shrink-0">
          <FaFilter className="text-emerald-500" size={12} /> Filtros
        </div>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <select
          value={filtroMarca}
          onChange={(e) => setFiltroMarca(e.target.value)}
          className="px-4 py-2.5 bg-[#0a0a0c] border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 appearance-none cursor-pointer"
        >
          <option value="">Todas as marcas</option>
          {marcas?.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Sincronizando catálogo..." />
        ) : !data?.result.length ? (
          <EmptyState title="Nenhum produto encontrado" icon={<FaBoxOpen size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {data.result.map((produto) => (
              <div key={produto.id} className="flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-700">
                    {produto.imagem ? <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" /> : <FaBoxOpen size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold truncate">{produto.nome}</p>
                      {!produto.situacao && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 font-mono">
                      {produto.codigo} {produto.marca ? `· ${produto.marca.nome}` : ""} · {produto.pontos ?? 0} pts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(produto)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                    <FaPencilAlt size={13} />
                  </button>
                  <button onClick={() => confirmDelete(produto)} className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.pageInfo && (
          <div className="p-5 md:p-6 border-t border-white/5">
            <Pagination pageInfo={data.pageInfo} onChange={setPagina} />
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editing ? "Editar Produto" : "Novo Produto"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código SKU</Label>
              <Input id="codigo" placeholder="Ex: REF-000" {...register("codigo")} />
              <FieldError>{errors.codigo?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pontos">Pontuação</Label>
              <Input id="pontos" type="number" placeholder="0" {...register("pontos")} />
              <FieldError>{errors.pontos?.message}</FieldError>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do produto</Label>
            <Input id="nome" placeholder="Nome comercial do produto" {...register("nome")} />
            <FieldError>{errors.nome?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={3} placeholder="Detalhes adicionais do produto..." {...register("descricao")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="id_marca">Marca</Label>
              <Select id="id_marca" {...register("id_marca")}>
                <option value="">Sem marca</option>
                {marcas?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (opcional)</Label>
              <Input id="preco" type="number" step="0.01" placeholder="0,00" {...register("preco")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem">URL da imagem</Label>
            <Input id="imagem" placeholder="https://exemplo.com/foto.jpg" {...register("imagem")} />
          </div>

          <div className="space-y-2">
            <Label>Categorias</Label>
            <CategoriasManager selected={categoriasSelecionadas} onToggle={toggleCategoria} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" {...register("situacao")} className="w-5 h-5 rounded accent-emerald-500" />
            <span className="text-sm text-gray-300">Produto ativo no catálogo</span>
          </label>

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
