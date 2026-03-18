import React, { useState } from 'react'
import PaginationComponent from '../../components/Pagination';
import { FaPencilAlt, FaTrashAlt, FaStore } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { QueryGetLojas } from '../../graphql/Loja/Query';
import { LojaModal } from './partials/Modal';
import { MutationDeleteLoja } from '../../graphql/Loja/Mutation';

export default function Lojas() {
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  const { data, loading, error } = QueryGetLojas({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      }
    },
  });

  const { HandleDeleteLoja, loading: loadingDelete } = MutationDeleteLoja();

  const swalConfig = {
    background: "#0d0d10",
    color: "#fff",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#1f1f23",
  };

  if (loadingDelete) {
    Swal.fire({
      title: "Processando...",
      background: "#0d0d10",
      color: "#fff",
      didOpen: () => Swal.showLoading(),
    });
  }

  function confirmDelete(id: number) {
    Swal.fire({
      ...swalConfig,
      title: "Excluir Unidade?",
      text: "Esta ação removerá a loja permanentemente do sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await HandleDeleteLoja(id);
        if (!result) {
          Swal.fire({ ...swalConfig, title: "Erro!", text: "Falha na execução.", icon: "error" });
        } else {
          Swal.fire({ ...swalConfig, title: "Sucesso!", text: "Unidade removida.", icon: "success" });
        }
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Unidades</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1">
              {loading ? "Sincronizando..." : `${data?.GetLojas.pageInfo.totalItems} Lojas registradas`}
            </p>
          </div>
        </div>
        <LojaModal />
      </div>

      {/* TABELA DE LOJAS */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Unidade / Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-center">Razão Social</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={3} className="py-20 text-center text-gray-600 animate-pulse">Carregando ativos...</td></tr>
              ) : error ? (
                <tr><td colSpan={3} className="py-20 text-center text-red-500">Erro na conexão com o banco de dados.</td></tr>
              ) : (
                data?.GetLojas.result.map((loja) => (
                  <tr key={loja.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <FaStore size={18} />
                        </div>
                        <span className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">
                          {loja.nome_fantasia}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-gray-500 font-medium italic">
                      {loja.razao_social}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                          <FaPencilAlt size={16} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(loja.id)}
                          className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO DARK */}
        {data && (
          <div className="p-6 bg-white/[0.01] border-t border-white/5">
            <PaginationComponent
              pagesInfo={data.GetLojas.pageInfo}
              setPagesInfo={(p: number, q: number) => setPaginacao({ pagina: p, quantidade: q })}
            />
          </div>
        )}
      </div>
    </div>
  );
}