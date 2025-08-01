import React, { useState } from "react";
import Swal from "sweetalert2";
import { QueryGetFuncionarios } from "../../graphql/Usuario/Query";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RelatorioModal } from "./Reports";
import { VendasUsuarioModal } from "./Sells";
import { formatPhoneNumber } from "../../utils/phoneUtils";
import { formatCPF } from "../../utils/documentUtils";
import { RecoveryModal } from "./partials/modalRecovery";

export default function Funcionarios() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  const { data, loading, error } = QueryGetFuncionarios({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
    },
  });

  // const { HandleDeleteProduto, loading: loadingSet } = MutationDeleteProduto();
  // if (loadingSet) {
  //   Swal.fire("Enviando Informações...", "");
  //   Swal.showLoading();
  // }

  function confirmDelete(id: number) {
    Swal.fire({
      title: "Tem certeza que deseja excluir?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const result = await HandleDeleteProduto({
        //   variables: { deleteProdutoId: id },
        // });
        if (!result) {
          Swal.fire("ERRO!", "Ocorreu um erro durante a execução.", "warning");
        } else {
          Swal.fire("Sucesso!", "Funcionario deletado com sucesso.", "success");
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
              Funcionarios
            </span>
            <span className="text-gray-500 mt-1 font-semibold text-sm">
              {loading
                ? "Carregando produtos..."
                : error
                ? "Erro ao carregar funcionarios"
                : `${data?.GetUsuarios.length} usuário disponíveis.`}
            </span>
          </h3>

          <RelatorioModal />
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
                      <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                        Nome
                      </th>
                      <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                        CPF
                      </th>
                      <th className="p-0 min-w-36 text-left text-gray-700  py-3">
                        Email
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
                      data?.GetUsuarios.map((usuario) => (
                        <tr
                          key={usuario.id}
                          className="border-b border-gray-200"
                        >
                          <td className="text-left py-2">
                            <a
                              href="#"
                              className="text-gray-900 font-bold hover:text-primary mb-1 text-lg"
                            >
                              {usuario.nome}
                            </a>
                            <span className="text-gray-500 font-semibold block">
                              {usuario.funcao}
                            </span>
                          </td>
                          <td className="text-left">
                            <span className="text-gray-500 font-semibold block">
                              {usuario.cpf
                                ? formatCPF(usuario.cpf)
                                : "Não Informado"}
                            </span>
                          </td>
                          <td className="text-left">
                            <span className="text-gray-500 font-semibold block">
                              {usuario.email}
                            </span>
                          </td>

                          <td className="text-right py-2">
                            <VendasUsuarioModal idUser={usuario.id} />

                            <RecoveryModal id={usuario.id} />
                            <button
                              onClick={() => {
                                confirmDelete(parseInt(usuario.id));
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
              {/* {data ? (
              <PaginationComponent
                pagesInfo={data.GetProdutos.pageInfo}
                setPagesInfo={(pagina: number, quantidade: number) => {
                  setPaginacao({ pagina: pagina, quantidade: quantidade });
                }}
              ></PaginationComponent>
            ) : (
              <></>
            )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
