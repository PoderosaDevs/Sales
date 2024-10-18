import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaCaretDown, FaCaretUp } from "react-icons/fa";
import Swal from "sweetalert2";
import { QueryGetMarcas } from "../../graphql/Marca/Query";
import { MutationDeleteProduto } from "../../graphql/Produto/Mutation";
import { MarcaModal } from "./partials/Modal";

export default function Marcas() {
  const [expandedMarca, setExpandedMarca] = useState<number | null>(null); // controla qual marca está expandida
  const [filterText, setFilterText] = useState<string>("");

  const { data, loading, error } = QueryGetMarcas();

  const { HandleDeleteProduto, loading: loadingSet } = MutationDeleteProduto();
  if (loadingSet) {
    Swal.fire("Enviando Informações...", "");
    Swal.showLoading();
  }

  function confirmDelete(id: number) {
    Swal.fire({
      title: "Tem certeza que deseja excluir?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await HandleDeleteProduto({
          variables: { deleteProdutoId: id },
        });
        if (!result) {
          Swal.fire("ERRO!", "Ocorreu um erro durante a execução.", "warning");
        } else {
          Swal.fire("Sucesso!", "Produto deletado com sucesso.", "success");
        }
      }
    });
  }

  function toggleExpand(marcaId: number) {
    setExpandedMarca(expandedMarca === marcaId ? null : marcaId);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  return (
    <div className="max-w-[1500px] pt-10 m-auto">
      <div className="bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <div className="flex justify-between items-start border-0">
          <h3 className="flex flex-col items-start">
            <span className="font-bold text-3xl text-gray-800 mb-1">
              Marcas
            </span>
            <span className="text-gray-500 mt-1 font-semibold text-sm">
              {loading
                ? "Carregando marcas..."
                : error
                  ? "Erro ao carregar marcas"
                  : `${data?.GetMarcas.length} marcas disponíveis.`}
            </span>
          </h3>

          <MarcaModal />
        </div>

        <div className="py-3">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="kt_table_widget_5_tab_1">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y border-t-2 divide-gray-200">
                  <thead>
                    <tr className="border-0">
                      <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                        Nome da Marca
                      </th>
                      <th className="p-0 min-w-36 text-gray-700 text-left py-3">
                        Produtos
                      </th>
                      <th className="p-0 min-w-28 justify-end flex py-3">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1.5">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10">
                          Carregando...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-red-500">
                          Erro ao carregar as marcas: {error.message}
                        </td>
                      </tr>
                    ) : (
                      data?.GetMarcas.map((marca) => (
                        <>
                          <tr key={marca.id} className="border-b border-gray-200">
                            <td className="text-left py-2">
                              <span className="text-gray-900 font-bold hover:text-primary mb-1 text-lg">
                                {marca.nome}
                              </span>
                            </td>
                            <td className="text-center py-2">
                              <button
                                className={`bg-blue-100 text-blue-600 px-3 text-sm py-2 flex items-center justify-center space-x-2 rounded-xl hover:bg-blue-200 `}
                                onClick={() => toggleExpand(marca.id)}
                              >
                                {expandedMarca === marca.id ? (
                                  <FaCaretUp size={18} />
                                ) : (
                                  <FaCaretDown size={18} />
                                )}
                                <span>
                                  {expandedMarca === marca.id ? "Ocultar Produtos" : "Exibir Produtos"}
                                </span>
                              </button>
                            </td>
                            <td className="text-right py-2">
                              <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                                <FaPencilAlt size={18} />
                              </button>
                              <button
                                onClick={() => confirmDelete(marca.id)}
                                className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200"
                              >
                                <FaTrashAlt size={18} />
                              </button>
                            </td>
                          </tr>

                          {/* Subtabela de produtos */}
                          {expandedMarca === marca.id && (
                            <tr>
                              <td colSpan={3} className="bg-gray-50 p-4">
                                <div className="w-full flex border-b-2 justify-between items-center">
                                  <h4 className="font-bold text-lg mb-2">
                                    Produtos Associados
                                  </h4>
                                  <div className="mb-4 flex space-x-3">
                                    <input
                                      type="text"
                                      value={filterText}
                                      onChange={handleFilterChange}
                                      placeholder="Filtrar produtos..."
                                      className="p-2 border border-gray-300 rounded"
                                    />
                                    <button className="bg-gray-900 text-white py-3 px-2 rounded-xl text-sm">
                                      Associar novos produtos
                                    </button>
                                  </div>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th className="p-2 text-left">Nome</th>
                                      <th className="p-2 text-left">Código</th>
                                      <th className="p-2 text-left">Imagem</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {marca.produtos && marca.produtos.length > 0 ? (
                                      marca.produtos
                                        .filter((produto) =>
                                          produto.nome
                                            .toLowerCase()
                                            .includes(filterText.toLowerCase())
                                        )
                                        .map((produto) => (
                                          <tr key={produto.id}>
                                            <td className="p-2">
                                              {produto.nome}
                                            </td>
                                            <td className="p-2">
                                              {produto.codigo}
                                            </td>
                                            <td className="p-2">
                                              <img
                                                src={produto.imagem}
                                                alt={produto.nome}
                                                className="w-12 h-12 rounded"
                                              />
                                            </td>
                                          </tr>
                                        ))
                                    ) : (
                                      <tr>
                                        <td colSpan={3} className="text-center py-2 text-gray-500">
                                          Nenhum produto associado.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
