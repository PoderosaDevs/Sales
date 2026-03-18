import React, { useState } from "react";
import Swal from "sweetalert2";
import { QueryGetFuncionarios } from "../../graphql/Usuario/Query";
import { FaPencilAlt, FaTrashAlt, FaUsers, FaUserTie, FaIdCard, FaEnvelope } from "react-icons/fa";
import { RelatorioModal } from "./Reports";
import { VendasUsuarioModal } from "./Sells";
import { formatPhoneNumber } from "../../utils/phoneUtils";
import { formatCPF } from "../../utils/documentUtils";
import { RecoveryModal } from "./partials/modalRecovery";
import { BounceLoader } from "react-spinners";
import PaginationComponent from "../../components/Pagination";

export default function Funcionarios() {
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  const { data, loading, error } = QueryGetFuncionarios({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
    },
  });

  // Configuração padrão do SweetAlert2 para o tema Dark
  const swalConfig = {
    background: "#0d0d10",
    color: "#fff",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#1f1f23",
  };

  function confirmDelete(id: number) {
    Swal.fire({
      ...swalConfig,
      title: "Remover Colaborador?",
      text: "O acesso deste usuário será revogado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar Exclusão",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Lógica de exclusão comentada conforme original
        // const result = await HandleDeleteProduto({ variables: { deleteProdutoId: id } });
        
        // Simulação do feedback de sucesso baseado no seu código
        Swal.fire({
          ...swalConfig,
          title: "Sucesso!",
          text: "Funcionário removido com sucesso.",
          icon: "success"
        });
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Equipe</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1">
              {loading ? "Sincronizando colaboradores..." : `${data?.GetUsuarios.length} Usuários ativos no sistema`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {/* O RelatorioModal assume o estilo do botão de ação principal aqui */}
            <RelatorioModal />
        </div>
      </div>

      {/* TABELA DE FUNCIONÁRIOS */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                <th className="px-8 py-5">Colaborador / Função</th>
                <th className="px-8 py-5 text-center">Documento (CPF)</th>
                <th className="px-8 py-5 text-center">Contato Principal</th>
                <th className="px-8 py-5 text-right">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <BounceLoader color="#10b981" size={40} />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Acessando base de dados</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-red-500 text-xs font-bold uppercase tracking-widest">
                    Erro ao carregar colaboradores: {error.message}
                  </td>
                </tr>
              ) : (
                data?.GetUsuarios.map((usuario: any) => (
                  <tr key={usuario.id} className="group hover:bg-white/[0.01] transition-colors">
                    {/* Nome e Função */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <FaUserTie size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base group-hover:text-emerald-400 transition-colors cursor-default">
                            {usuario.nome}
                          </span>
                          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                            {usuario.funcao || "Colaborador"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CPF */}
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 text-gray-400 text-sm font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <FaIdCard size={12} className="opacity-30" />
                        {usuario.cpf ? formatCPF(usuario.cpf) : "Não Informado"}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-8 py-5 text-center">
                       <div className="inline-flex items-center gap-2 text-gray-400 text-sm hover:text-emerald-400 transition-colors cursor-pointer">
                        <FaEnvelope size={12} className="opacity-30" />
                        {usuario.email}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* Botões que disparam Modais Customizados */}
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                            <VendasUsuarioModal idUser={usuario.id} />
                            <RecoveryModal id={usuario.id} />
                        </div>
                        
                        {/* Botão de Excluir padrão */}
                        <button
                          onClick={() => confirmDelete(parseInt(usuario.id))}
                          className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300"
                          title="Remover Acesso"
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

        {/* PAGINAÇÃO PADRONIZADA */}
        {data && (
          <div className="p-6 bg-white/[0.01] border-t border-white/5">
            <PaginationComponent
              pagesInfo={{
                  currentPage: paginacao.pagina,
                  totalPages: Math.ceil(data.GetUsuarios.length / paginacao.quantidade), // Cálculo aproximado baseado no array se não houver pageInfo no query
                  totalItems: data.GetUsuarios.length
              }}
              setPagesInfo={(pagina: number, quantidade: number) => {
                setPaginacao({ pagina: pagina, quantidade: quantidade });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}