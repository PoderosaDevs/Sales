import { Link } from "react-router-dom";
import { IoAlertCircleOutline } from "react-icons/io5";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
        <IoAlertCircleOutline size={40} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Página não encontrada</h1>
        <p className="text-gray-500 text-sm mt-2">
          Você não tem acesso a esta página ou ela não existe.
        </p>
      </div>
      <Link
        to="/"
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
