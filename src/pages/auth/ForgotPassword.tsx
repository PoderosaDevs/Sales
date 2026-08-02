import { Link } from "react-router-dom";
import { IoArrowBackOutline, IoKeyOutline } from "react-icons/io5";

export function ForgotPassword() {
  return (
    <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-2xl text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
        <IoKeyOutline size={28} />
      </div>
      <h1 className="text-xl font-bold text-white">Esqueceu sua senha?</h1>
      <p className="text-gray-400 text-sm mt-3 leading-relaxed">
        Por segurança, a redefinição de senha é feita por um administrador ou gerente da sua
        equipe. Fale com quem cadastrou sua conta para receber uma nova senha.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-gray-200 transition-all"
      >
        <IoArrowBackOutline size={16} />
        Voltar ao login
      </Link>
    </div>
  );
}
