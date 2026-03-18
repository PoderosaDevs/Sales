import React, { useState } from "react"; // Adicionado useState
import { Link } from "react-router-dom";
import { MutationLogin } from "../../graphql/Usuario/Mutation";
import { BounceLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importação dos ícones
import Swal from "sweetalert2";

function LoginComponent() {
  const { FormLogin, handleSubmit, register, loading } = MutationLogin();
  
  // Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const result = await FormLogin(data);
      if (result.data?.Login) {
        localStorage.setItem("token", result.data.Login.token_api);
        window.location.replace("/");
      } else {
        throw new Error("Login inválido");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Acesso Negado",
        text: "Verifique suas credenciais e tente novamente.",
        background: '#121214',
        color: '#fff',
        confirmButtonColor: '#10b981',
      });
    }
  };

  return (
    <div className="w-full">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Input Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
            E-mail Profissional
          </label>
          <input
            type="email"
            className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 shadow-inner"
            placeholder="nome@empresa.com"
            {...register("email")}
          />
        </div>

        {/* Input Senha */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
              Senha
            </label>
            <Link to="/forgot-password" className="text-emerald-500 text-[11px] font-semibold hover:text-emerald-400 transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
          
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 shadow-inner"
              placeholder="••••••••"
              {...register("senha")}
            />
            
            {/* Botão de Toggle da Senha */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <BounceLoader color="#ffffff" size={20} /> : (
              <>
                <span className="tracking-widest text-sm">ENTRAR NO SISTEMA</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
          {/* Efeito de brilho */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* Footer do Form */}
        <div className="pt-6 text-center border-t border-white/5">
          <p className="text-gray-500 text-sm font-medium">
            Não possui acesso?{" "}
            <Link to="/register" className="text-white hover:text-emerald-400 font-bold transition-colors">
              Solicitar Cadastro
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginComponent;