import Swal from "sweetalert2";
import { FaSignOutAlt, FaShieldAlt, FaInfoCircle, FaUserCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Configuracoes() {
  const { usuario, logout } = useAuth();

  const confirmLogout = () => {
    Swal.fire({
      title: "Encerrar sessão?",
      text: "Você precisará entrar novamente para acessar o sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#334155",
      background: "#0d0d10",
      color: "#fff",
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) logout();
    });
  };

  if (!usuario) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Configurações</h1>
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-3xl overflow-hidden shadow-2xl divide-y divide-white/5">
        <Link to="/perfil" className="flex items-center justify-between p-5 md:p-6 hover:bg-white/[0.03] transition-colors group">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 flex-shrink-0">
              <FaUserCog size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">Dados da conta</p>
              <p className="text-gray-500 text-xs mt-0.5 truncate">Editar foto, data de nascimento e senha</p>
            </div>
          </div>
          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest group-hover:text-emerald-500 transition-colors flex-shrink-0 ml-3">
            Abrir
          </span>
        </Link>

        <div className="flex items-center justify-between p-5 md:p-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 bg-white/5 rounded-xl text-gray-400 flex-shrink-0">
              <FaShieldAlt size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">Segurança de dados</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Nome, CPF, e-mail e função só podem ser alterados por um gerente ou administrador.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 md:p-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 bg-white/5 rounded-xl text-gray-400 flex-shrink-0">
              <FaInfoCircle size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">Sobre o sistema</p>
              <p className="text-gray-500 text-xs mt-0.5">Poderosa Beleza · Sistema de Vendas e Pontos</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={confirmLogout}
        className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
      >
        <FaSignOutAlt size={16} />
        Encerrar sessão
      </button>
    </div>
  );
}
