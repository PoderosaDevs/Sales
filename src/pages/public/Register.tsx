import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MutationSetUsuario } from "../../graphql/Usuario/Mutation";
import PasswordFields from "./partials/PasswordsFields";
import { BounceLoader } from "react-spinners"; // Substituindo o Swal de carregamento por algo mais moderno
import Swal from "sweetalert2";

function Register() {
  const { register, FormSetUsuario, loading, handleSubmit, errors } = MutationSetUsuario();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const result = await FormSetUsuario(data);

      if (result?.networkError?.response?.status === 400 || (result?.errors && result.errors.length > 0)) {
        const errorMessage = result.errors?.[0]?.message === "Email já cadastrado no sistema!" 
          ? "Este e-mail já está em uso em nossa base." 
          : "Não foi possível processar seu cadastro agora.";

        Swal.fire({
          icon: "error",
          title: "Ops!",
          text: errorMessage,
          background: '#121214',
          color: '#fff',
          confirmButtonColor: '#10b981',
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Bem-vinda ao Paraíso!",
        text: "Sua conta foi criada com sucesso.",
        background: '#121214',
        color: '#fff',
        confirmButtonColor: '#10b981',
      }).then(() => navigate("/"));
      
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erro no Sistema",
        text: "Houve uma falha na comunicação. Tente novamente.",
        background: '#121214',
        color: '#fff',
        confirmButtonColor: '#10b981',
      });
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Campo Nome */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            className={`w-full px-4 py-3 bg-white/[0.03] border ${
              errors.nome ? "border-red-500/50" : "border-white/10"
            } rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-inner`}
            placeholder="Como deseja ser chamada?"
            {...register("nome")}
            onKeyPress={(event) => {
              const regex = /^[A-Za-z\s]+$/;
              if (!regex.test(event.key)) event.preventDefault();
            }}
          />
          {errors.nome && (
            <span className="text-red-400 text-xs ml-1 font-medium">{errors.nome.message}</span>
          )}
        </div>

        {/* Campo Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-3 bg-white/[0.03] border ${
              errors.email ? "border-red-500/50" : "border-white/10"
            } rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-inner`}
            placeholder="seu@email.com"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</span>
          )}
        </div>

        {/* Campos de Senha (Lembre-se de atualizar o estilo interno deste componente também) */}
        <div className="py-2">
            <PasswordFields errors={errors} register={register} />
        </div>

        {/* Botão Registrar */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] mt-4"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <BounceLoader color="#ffffff" size={20} /> : (
              <>
                <span>FINALIZAR CADASTRO</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </div>
        </button>

        <div className="pt-6 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Já possui uma conta?{" "}
            <Link to="/" className="text-white hover:text-emerald-400 font-bold transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;