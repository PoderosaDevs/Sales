import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaUserTie, FaKey, FaChartLine, FaIdCard, FaEnvelope } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useUsuarios, useCreateUsuario, useUpdateUsuario, useDeleteUsuario, useRecoverySenha } from "../../hooks/useUsuarios";
import { Button } from "../../components/ui/button";
import { Input, Label, Select, FieldError } from "../../components/ui/input";
import { Dialog } from "../../components/ui/dialog";
import { Loader, EmptyState } from "../../components/Loader";
import { api, extractErrorMessage } from "../../lib/api";
import { TipoPessoa, Usuario } from "../../types";

const tipoPessoaLabel: Record<TipoPessoa, string> = {
  [TipoPessoa.ADMIN]: "Administrador",
  [TipoPessoa.MANAGER]: "Gerente",
  [TipoPessoa.EMPLOYEE]: "Vendedora",
  [TipoPessoa.USER]: "Usuário",
  [TipoPessoa.GUEST]: "Convidado",
};

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

const createSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  funcao: z.string().optional(),
  cpf: z.string().optional(),
  tipo_pessoa: z.nativeEnum(TipoPessoa),
});
const editSchema = createSchema.extend({ senha: z.string().min(6).optional().or(z.literal("")) });
type FormData = z.infer<typeof createSchema>;

const statusLabel: Record<"ativos" | "inativos" | "todos", string> = {
  ativos: "Ativos",
  inativos: "Inativos",
  todos: "Todos",
};

export function Funcionarios() {
  const [filtroTipo, setFiltroTipo] = useState<TipoPessoa | "">("");
  const [filtroStatus, setFiltroStatus] = useState<"ativos" | "inativos" | "todos">("ativos");
  const { data: usuarios, isLoading } = useUsuarios(filtroTipo || undefined, filtroStatus);
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();
  const recoverySenha = useRecoverySenha();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(editing ? editSchema : createSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ nome: "", email: "", senha: "", funcao: "", cpf: "", tipo_pessoa: TipoPessoa.EMPLOYEE });
    setIsOpen(true);
  };

  const openEdit = (usuario: Usuario) => {
    setEditing(usuario);
    reset({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      funcao: usuario.funcao ?? "",
      cpf: usuario.cpf ?? "",
      tipo_pessoa: usuario.tipo_pessoa,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        const { senha, ...rest } = data;
        await updateUsuario.mutateAsync({ id: editing.id, ...rest, ...(senha ? { senha } : {}) });
      } else {
        await createUsuario.mutateAsync(data);
      }
      setIsOpen(false);
      Swal.fire({ ...swalConfig, icon: "success", title: "Sucesso!", text: "Colaborador salvo." });
    } catch (error) {
      Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível salvar.") });
    }
  };

  const confirmDelete = async (usuario: Usuario) => {
    Swal.fire({ ...swalConfig, title: "Verificando vendas...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    let vendasCount = 0;
    try {
      const { data } = await api.get<{ count: number }>(`/vendas/usuario/${usuario.id}/count`);
      vendasCount = data.count;
    } catch {
      // se a contagem falhar, segue com o aviso genérico mesmo assim
    }

    Swal.fire({
      ...swalConfig,
      title: "Excluir permanentemente?",
      html:
        vendasCount > 0
          ? `Isso vai apagar <strong>"${usuario.nome}"</strong> e as <strong>${vendasCount} venda${
              vendasCount === 1 ? "" : "s"
            }</strong> registradas por ele(a). Essa ação não pode ser desfeita.`
          : `Isso vai apagar <strong>"${usuario.nome}"</strong> permanentemente. Não há vendas registradas por ele(a). Essa ação não pode ser desfeita.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir tudo",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteUsuario.mutateAsync(usuario.id);
        Swal.fire({ ...swalConfig, icon: "success", title: "Excluído permanentemente!" });
      } catch (error) {
        Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível excluir.") });
      }
    });
  };

  const resetSenha = (usuario: Usuario) => {
    Swal.fire({
      ...swalConfig,
      title: `Redefinir senha de ${usuario.nome.split(" ")[0]}`,
      input: "text",
      inputPlaceholder: "Nova senha temporária (mín. 6 caracteres)",
      showCancelButton: true,
      confirmButtonText: "Redefinir",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => (!value || value.length < 6 ? "A senha deve ter ao menos 6 caracteres." : undefined),
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        await recoverySenha.mutateAsync({ id: usuario.id, senha: result.value });
        Swal.fire({ ...swalConfig, icon: "success", title: "Senha redefinida!" });
      } catch (error) {
        Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível redefinir.") });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Equipe</h1>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <FaPlus size={12} /> Novo Colaborador
        </Button>
      </div>

      <div className="flex items-start gap-3 p-4 sm:p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
        <FaTriangleExclamation className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-red-200/90 text-xs sm:text-sm leading-relaxed">
          <span className="font-bold text-red-400">Atenção:</span> excluir um colaborador remove permanentemente ele e{" "}
          <span className="font-bold">todas as vendas registradas por ele</span> do sistema. Não é possível desfazer essa ação.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(["", TipoPessoa.EMPLOYEE, TipoPessoa.MANAGER, TipoPessoa.ADMIN] as const).map((tipo) => (
            <button
              key={tipo || "todos"}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filtroTipo === tipo ? "bg-emerald-500 text-[#0a0a0c] border-emerald-500" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              }`}
            >
              {tipo ? tipoPessoaLabel[tipo] : "Todos"}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-white/10 hidden sm:block" />
        <div className="flex gap-2 flex-wrap">
          {(["ativos", "inativos", "todos"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filtroStatus === status
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
              }`}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Sincronizando colaboradores..." />
        ) : !usuarios?.length ? (
          <EmptyState title="Nenhum colaborador encontrado" icon={<FaUserTie size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                    <FaUserTie size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{usuario.nome}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{tipoPessoaLabel[usuario.tipo_pessoa]}</span>
                      {usuario.situacao === false && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-wider">
                          Inativo
                        </span>
                      )}
                      <span className="text-gray-600 text-xs flex items-center gap-1 truncate">
                        <FaEnvelope size={10} className="opacity-50" /> {usuario.email}
                      </span>
                      {usuario.cpf && (
                        <span className="text-gray-600 text-xs flex items-center gap-1 font-mono">
                          <FaIdCard size={10} className="opacity-50" /> {usuario.cpf}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <Link
                    to={`/backoffice/employee/${usuario.id}`}
                    className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all"
                    title="Ver performance"
                  >
                    <FaChartLine size={13} />
                  </Link>
                  <button onClick={() => resetSenha(usuario)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all" title="Redefinir senha">
                    <FaKey size={13} />
                  </button>
                  <button onClick={() => openEdit(usuario)} className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all" title="Editar">
                    <FaPencilAlt size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete(usuario)}
                    className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    title="Excluir permanentemente (colaborador + vendas)"
                  >
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editing ? "Editar Colaborador" : "Novo Colaborador"} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" {...register("nome")} />
            <FieldError>{errors.nome?.message}</FieldError>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">{editing ? "Nova senha (opcional)" : "Senha inicial"}</Label>
              <Input id="senha" type="password" placeholder={editing ? "Deixe em branco para manter" : ""} {...register("senha")} />
              <FieldError>{errors.senha?.message}</FieldError>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="funcao">Função</Label>
              <Input id="funcao" placeholder="Ex: Vendedora, Recepção..." {...register("funcao")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_pessoa">Perfil de acesso</Label>
            <Select id="tipo_pessoa" {...register("tipo_pessoa")}>
              <option value={TipoPessoa.EMPLOYEE}>Vendedora</option>
              <option value={TipoPessoa.MANAGER}>Gerente</option>
              <option value={TipoPessoa.ADMIN}>Administrador</option>
            </Select>
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
