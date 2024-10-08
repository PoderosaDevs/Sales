import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { QueryGetProdutos } from "../../graphql/Produto/Query";
import * as Dialog from "@radix-ui/react-dialog";
import { ProductModal } from "./partials/Modal";
import { X } from "phosphor-react";
import Swal from "sweetalert2";
import { MutationDeleteProduto } from "../../graphql/Produto/Mutation";
import PaginationComponent from "../../components/Pagination";

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

  return (
    <div className="max-w-[1500px] pt-10 m-auto">
      <div className="bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <div className="flex justify-between items-start border-0">
          <h3 className="flex flex-col items-start">
            <span className="font-bold text-3xl text-gray-800 mb-1">
              Produtos
            </span>
            <span className="text-gray-500 mt-1 font-semibold text-sm">
              {loading
                ? "Carregando produtos..."
                : error
                ? "Erro ao carregar produtos"
                : `${data?.GetProdutos.pageInfo.totalItems} produtos disponíveis.`}
            </span>
          </h3>

          <ProductModal />
        </div>

        <div className="py-3">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="kt_table_widget_5_tab_1"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y border-t-2 divide-gray-200">
                  <thead>
                    <tr className="border-0">
                      <th className="p-0 max-w-8"></th>
                      <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                        Nome
                      </th>
                      <th className="p-0 min-w-36 text-gray-700 text-center py-3">
                        Pontos
                      </th>
                      <th className="p-0 min-w-36 text-gray-700 text-center py-3">
                        Vendas
                      </th>
                      <th className="p-0 min-w-36 text-gray-700 text-center py-3">
                        Situação
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
                        <td
                          colSpan={7}
                          className="text-center py-10 text-red-500"
                        >
                          Erro ao carregar os produtos: {error.message}
                        </td>
                      </tr>
                    ) : (
                      data?.GetProdutos.result.map((produto) => (
                        <tr
                          key={produto.id}
                          className="border-b border-gray-200"
                        >
                          <td className="flex justify-center py-2">
                            <img
                              className="w-20 h-20 object-cover cursor-pointer"
                              src={produto.imagem}
                              alt={produto.nome}
                              onClick={() => setSelectedImage(produto.imagem)}
                            />
                          </td>
                          <td className="text-left py-2">
                            <a
                              href="#"
                              className="text-gray-900 font-bold hover:text-primary mb-1 text-lg"
                            >
                              {produto.nome}
                            </a>
                            <span className="text-gray-500 font-semibold block">
                              {produto.descricao}
                            </span>
                          </td>
                          <td className="text-center text-gray-500 font-semibold py-2">
                            {produto.pontos}
                          </td>
                          <td className="text-center text-gray-500 font-semibold py-2">
                            {produto.itens_por_caixa} UND
                          </td>
                          <td className="text-center py-2">
                            <span
                              className={`inline-block py-2 px-3 rounded-full text-xs font-medium ${
                                produto.situacao
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {produto.situacao ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                              <FaPencilAlt size={18} />
                            </button>
                            <button
                              onClick={() => {
                                confirmDelete(produto.id);
                              }}
                              className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {data ? (
                <PaginationComponent
                  pagesInfo={data.GetProdutos.pageInfo}
                  setPagesInfo={(pagina: number, quantidade: number) => {
                    setPaginacao({ pagina: pagina, quantidade: quantidade });
                  }}
                ></PaginationComponent>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative">
              <img
                src={selectedImage ?? ""}
                alt="Preview"
                className="max-w-full max-h-screen"
              />
              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-lg"
                  aria-label="Close"
                >
                  <X />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
