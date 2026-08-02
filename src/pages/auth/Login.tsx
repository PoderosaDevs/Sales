import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { Input, Label, FieldError } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const ok = await login(data.email, data.senha);
      if (ok) navigate("/", { replace: true });
      else setApiError("Não foi possível validar sua sessão. Tente novamente.");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Falha ao entrar.");
    }
  };

  return (
    <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-2xl">
      <h1 className="text-2xl font-bold text-white text-center">Bem-vinda de volta</h1>
      <p className="text-gray-500 text-sm text-center mt-2 mb-8">Entre com sua conta para continuar.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input id="email" type="email" autoComplete="email" placeholder="voce@empresa.com" className="pl-11" {...register("email")} />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input
              id="senha"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-11 pr-11"
              {...register("senha")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
          <FieldError>{errors.senha?.message}</FieldError>
        </div>

        {apiError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {apiError}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors font-medium">
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
