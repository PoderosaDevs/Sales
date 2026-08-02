import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaUserCircle, FaIdBadge, FaImage, FaBirthdayCake, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useUsuario, useUpdateOwnProfile, useChangeOwnPassword } from "../../hooks/useUsuarios";
import { Input, Label, FieldError } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/card";
import { Loader } from "../../components/Loader";
import { extractErrorMessage } from "../../lib/api";
import { TipoPessoa } from "../../types";

const tipoPessoaLabel: Record<TipoPessoa, string> = {
  [TipoPessoa.ADMIN]: "Administrador",
  [TipoPessoa.MANAGER]: "Gerente",
  [TipoPessoa.EMPLOYEE]: "Vendedora",
  [TipoPessoa.USER]: "Usuário",
  [TipoPessoa.GUEST]: "Convidado",
};

const perfilSchema = z.object({
  usuario_foto: z.string().url("Informe uma URL de imagem válida.").or(z.literal("")).optional(),
  data_nascimento: z.string().optional(),
});
type PerfilForm = z.infer<typeof perfilSchema>;

const senhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Informe sua senha atual."),
    novaSenha: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres."),
    confirmarSenha: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });
type SenhaForm = z.infer<typeof senhaSchema>;

function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function Perfil() {
  const { usuario } = useAuth();
  const { data: usuarioCompleto, isLoading } = useUsuario(usuario?.id);
  const updateProfile = useUpdateOwnProfile();
  const changePassword = useChangeOwnPassword();

  const {
    register: registerPerfil,
    handleSubmit: handlePerfilSubmit,
    reset: resetPerfil,
    watch,
    formState: { errors: perfilErrors, isSubmitting: isSavingPerfil },
  } = useForm<PerfilForm>({ resolver: zodResolver(perfilSchema) });

  const {
    register: registerSenha,
    handleSubmit: handleSenhaSubmit,
    reset: resetSenha,
    formState: { errors: senhaErrors, isSubmitting: isSavingSenha },
  } = useForm<SenhaForm>({ resolver: zodResolver(senhaSchema) });

  useEffect(() => {
    if (usuarioCompleto) {
      resetPerfil({
        usuario_foto: usuarioCompleto.usuario_foto ?? "",
        data_nascimento: toDateInputValue(usuarioCompleto.data_nascimento),
      });
    }
  }, [usuarioCompleto, resetPerfil]);

  const fotoPreview = watch("usuario_foto");

  if (!usuario) return null;

  const onSavePerfil = async (data: PerfilForm) => {
    try {
      await updateProfile.mutateAsync({
        id: usuario.id,
        usuario_foto: data.usuario_foto || undefined,
        data_nascimento: data.data_nascimento || undefined,
      });
      Swal.fire({
        icon: "success",
        title: "Perfil atualizado",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: extractErrorMessage(error, "Não foi possível salvar o perfil."),
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const onChangeSenha = async (data: SenhaForm) => {
    try {
      await changePassword.mutateAsync({ id: usuario.id, senhaAtual: data.senhaAtual, novaSenha: data.novaSenha });
      resetSenha();
      Swal.fire({
        icon: "success",
        title: "Senha alterada",
        text: "Use a nova senha no próximo login.",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: extractErrorMessage(error, "Não foi possível alterar a senha."),
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Meu Perfil</h1>
      </div>

      {isLoading ? (
        <Loader label="Carregando perfil..." />
      ) : (
        <>
          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl flex items-center gap-5">
            {fotoPreview ? (
              <img src={fotoPreview} alt={usuario.nome} className="w-20 h-20 rounded-full object-cover border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 flex-shrink-0">
                <FaUserCircle size={40} />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{usuario.nome}</h2>
              <p className="text-gray-500 text-sm truncate">{usuario.email}</p>
              <Badge className="mt-2">
                <FaIdBadge size={10} /> {tipoPessoaLabel[usuario.tipo_pessoa]}
              </Badge>
            </div>
          </div>

          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Dados editáveis</h3>
              <p className="text-xs text-gray-500 mt-1">
                Nome, CPF, e-mail e função só podem ser alterados por um gerente ou administrador.
              </p>
            </div>

            <form onSubmit={handlePerfilSubmit(onSavePerfil)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="usuario_foto">
                  <FaImage className="inline mr-1.5 -mt-0.5" size={11} /> URL da foto de perfil
                </Label>
                <Input id="usuario_foto" type="text" placeholder="https://..." {...registerPerfil("usuario_foto")} />
                <FieldError>{perfilErrors.usuario_foto?.message}</FieldError>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">
                  <FaBirthdayCake className="inline mr-1.5 -mt-0.5" size={11} /> Data de nascimento
                </Label>
                <Input id="data_nascimento" type="date" className="[color-scheme:dark]" {...registerPerfil("data_nascimento")} />
                <FieldError>{perfilErrors.data_nascimento?.message}</FieldError>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSavingPerfil}>
                  {isSavingPerfil ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-[#0d0d10] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <FaLock size={12} className="text-emerald-500" /> Alterar senha
            </h3>

            <form onSubmit={handleSenhaSubmit(onChangeSenha)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha atual</Label>
                <Input id="senhaAtual" type="password" autoComplete="current-password" {...registerSenha("senhaAtual")} />
                <FieldError>{senhaErrors.senhaAtual?.message}</FieldError>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova senha</Label>
                  <Input id="novaSenha" type="password" autoComplete="new-password" {...registerSenha("novaSenha")} />
                  <FieldError>{senhaErrors.novaSenha?.message}</FieldError>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                  <Input id="confirmarSenha" type="password" autoComplete="new-password" {...registerSenha("confirmarSenha")} />
                  <FieldError>{senhaErrors.confirmarSenha?.message}</FieldError>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="secondary" disabled={isSavingSenha}>
                  {isSavingSenha ? "Alterando..." : "Alterar senha"}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
