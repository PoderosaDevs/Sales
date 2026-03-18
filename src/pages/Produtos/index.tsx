import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaBox, FaAward, FaEye } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { QueryGetProdutos } from "../../graphql/Produto/Query";
import * as Dialog from "@radix-ui/react-dialog";
import { ProductModal } from "./partials/Modal";
import { X } from "phosphor-react";
import Swal from "sweetalert2";
import { MutationDeleteProduto } from "../../graphql/Produto/Mutation";
import PaginationComponent from "../../components/Pagination";
import { BounceLoader } from "react-spinners";

export default function Produtos() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  const { data, loading, error } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  const { HandleDeleteProduto, loading: loadingDelete } = MutationDeleteProduto();

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
      title: "Excluir Produto?",
      text: "O item será removido permanentemente do catálogo de vendas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await HandleDeleteProduto({
          variables: { deleteProdutoId: parseInt(String(id)) },
        });
        if (!res) {
          Swal.fire({ ...swalConfig, title: "Erro!", text: "Falha na exclusão.", icon: "error" });
        } else {
          Swal.fire({ ...swalConfig, title: "Sucesso!", text: "Produto removido.", icon: "success" });
        }
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Catálogo Técnico</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1">
              {loading ? "Sincronizando..." : `${data?.GetProdutos.pageInfo.totalItems} Itens ativos no sistema`}
            </p>
          </div>
        </div>
        <ProductModal />
      </div>

      {/* TABELA DE PRODUTOS */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                <th className="px-8 py-5 text-center">Mídia</th>
                <th className="px-8 py-5">Identificação / SKU</th>
                <th className="px-8 py-5 text-center">Pontuação</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><BounceLoader color="#10b981" size={40} className="m-auto" /></td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="py-20 text-center text-red-500 text-xs font-bold uppercase">Erro de comunicação com o servidor.</td></tr>
              ) : (
                data?.GetProdutos.result.map((produto) => (
                  <tr key={produto.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-4">
                      <div className="relative w-16 h-16 mx-auto group/img cursor-pointer" onClick={() => setSelectedImage(produto.imagem)}>
                        <img
                          className="w-full h-full object-cover rounded-xl border border-white/10 group-hover/img:border-emerald-500/50 transition-all shadow-lg"
                          src={produto.imagem}
                          alt={produto.nome}
                        />
                        <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover/img:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                            <FaEye className="text-white" size={14} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-base group-hover:text-emerald-400 transition-colors">
                          {produto.nome}
                        </span>
                        <span className="text-gray-500 text-[10px] uppercase font-medium tracking-wider mt-0.5 line-clamp-1">
                          {produto.descricao || "Sem descrição técnica"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-emerald-500 font-mono text-sm font-bold">
                        <FaAward size={12} />
                        {produto.pontos}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`inline-block py-1 px-3 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        produto.situacao ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {produto.situacao ? "Operacional" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                          <FaPencilAlt size={14} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(produto.id)}
                          className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {data && (
          <div className="p-6 bg-white/[0.01] border-t border-white/5">
            <PaginationComponent
              pagesInfo={data.GetProdutos.pageInfo}
              setPagesInfo={(p: number, q: number) => setPaginacao({ pagina: p, quantidade: q })}
            />
          </div>
        )}
      </div>

      {/* MODAL DE PREVIEW DE IMAGEM */}
      <Dialog.Root open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 z-[110] outline-none">
             <div className="relative max-w-4xl w-full flex flex-col items-center">
                <img
                    src={selectedImage ?? ""}
                    alt="Preview"
                    className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border border-white/10 object-contain"
                />
                <button
                    onClick={() => setSelectedImage(null)}
                    className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[3px] rounded-2xl transition-all border border-white/10"
                >
                    Fechar Visualização
                </button>
             </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}