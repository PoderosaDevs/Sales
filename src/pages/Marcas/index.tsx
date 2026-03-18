import React, { useState } from "react";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaCaretDown,
  FaCaretUp,
  FaTags,
  FaBoxOpen,
  FaPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { QueryGetMarcas } from "../../graphql/Marca/Query";
import { MutationDeleteProduto } from "../../graphql/Produto/Mutation";
import { MarcaModal } from "./partials/Modal";
import { BounceLoader } from "react-spinners";

export default function Marcas() {
  const [expandedMarca, setExpandedMarca] = useState<number | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const { data, loading, error } = QueryGetMarcas();

  const { HandleDeleteProduto, loading: loadingSet } = MutationDeleteProduto();

  const swalConfig = {
    background: "#0d0d10",
    color: "#fff",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#1f1f23",
  };

  if (loadingSet) {
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
      title: "Remover Produto?",
      text: "Esta ação é irreversível no catálogo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await HandleDeleteProduto({
          variables: { deleteProdutoId: id },
        });
        if (!result) {
          Swal.fire({ ...swalConfig, title: "Erro!", text: "Falha na execução.", icon: "error" });
        } else {
          Swal.fire({ ...swalConfig, title: "Sucesso!", text: "Item removido.", icon: "success" });
        }
      }
    });
  }

  function toggleExpand(marcaId: number) {
    setExpandedMarca(expandedMarca === marcaId ? null : marcaId);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Marcas</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mt-1">
              {loading ? "Sincronizando..." : `${data?.GetMarcas.length} Fabricantes no portfólio`}
            </p>
          </div>
        </div>
        <MarcaModal />
      </div>

      {/* TABELA DE MARCAS */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Identidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Nome da Marca</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-center">Portfólio</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center"><BounceLoader color="#10b981" size={40} className="m-auto" /></td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="py-20 text-center text-red-500 uppercase text-xs font-bold">Erro ao carregar fabricantes.</td></tr>
              ) : (
                data?.GetMarcas.map((marca: any) => (
                  <React.Fragment key={marca.id}>
                    <tr className={`group transition-colors ${expandedMarca === marca.id ? 'bg-emerald-500/[0.03]' : 'hover:bg-white/[0.01]'}`}>
                      <td className="px-8 py-5">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-lg border border-white/10" 
                          style={{ backgroundColor: marca.cor }} 
                        />
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                          {marca.nome}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => toggleExpand(marca.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            expandedMarca === marca.id 
                            ? 'bg-emerald-500 text-[#0d0d10]' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {expandedMarca === marca.id ? <FaCaretUp size={14} /> : <FaCaretDown size={14} />}
                          {expandedMarca === marca.id ? "Ocultar" : "Ver Produtos"}
                        </button>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-3 bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all">
                            <FaPencilAlt size={14} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(marca.id)}
                            className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* SUB-TABELA DE PRODUTOS */}
                    {expandedMarca === marca.id && (
                      <tr>
                        <td colSpan={4} className="p-0 bg-[#0a0a0c]">
                          <div className="p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                              <div className="flex items-center gap-3">
                                <FaBoxOpen className="text-emerald-500" size={20} />
                                <h4 className="text-white font-bold text-base uppercase tracking-wider">Produtos Associados</h4>
                              </div>
                              <div className="flex gap-3 w-full md:w-auto">
                                <input
                                  type="text"
                                  placeholder="Filtrar nesta marca..."
                                  value={filterText}
                                  onChange={(e) => setFilterText(e.target.value)}
                                  className="flex-1 md:w-64 bg-[#0d0d10] border border-white/10 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-emerald-500/40"
                                />
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-emerald-500 text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all border border-emerald-500/20">
                                  <FaPlus size={10} /> Associar Itens
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {marca.produtos?.filter((p: any) => p.nome.toLowerCase().includes(filterText.toLowerCase()))
                                .map((produto: any) => (
                                  <div key={produto.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/item hover:border-emerald-500/30 transition-all">
                                    <img src={produto.imagem} alt={produto.nome} className="w-14 h-14 object-cover rounded-xl border border-white/10" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white font-bold text-sm truncate">{produto.nome}</p>
                                      <p className="text-gray-500 text-[10px] font-mono mt-0.5">SKU: {produto.codigo || 'N/A'}</p>
                                    </div>
                                    <button onClick={() => confirmDelete(produto.id)} className="opacity-0 group-hover/item:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all">
                                      <FaTrashAlt size={12} />
                                    </button>
                                  </div>
                                ))}
                                {(!marca.produtos || marca.produtos.length === 0) && (
                                  <div className="col-span-full py-10 text-center text-gray-600 text-xs uppercase font-bold tracking-widest opacity-50">
                                    Nenhum produto vinculado a esta marca.
                                  </div>
                                )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}