import React, { useState } from 'react'
import PaginationComponent from '../../components/Pagination';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { QueryGetLojas } from '../../graphql/Loja/Query';
import { LinhaModal } from './partials/Modal';
import { MutationDeleteLoja } from '../../graphql/Loja/Mutation';

export default function Lojas(){
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
  if (loadingDelete) {
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
        const result = await HandleDeleteLoja(id);
        if (!result) {
          Swal.fire("ERRO!", "Ocorreu um erro durante a execução.", "warning");
        } else {
          Swal.fire("Sucesso!", "Loja deletado com sucesso.", "success");
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
              Lojas
            </span>
            <span className="text-gray-500 mt-1 font-semibold text-sm">
              {loading
                ? "Carregando lojas..."
                : error
                ? "Erro ao carregar lojas"
                : `${data?.GetLojas.pageInfo.totalItems} lojas disponíveis.`}
            </span>
          </h3>

          <LinhaModal />
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
                        Nome Fantasia
                      </th>
                      <th className="p-0 min-w-36 text-gray-700 text-center py-3">
                        Razão Social
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
                          Erro ao carregar as lojas: {error.message}
                        </td>
                      </tr>
                    ) : (
                      data?.GetLojas.result.map((loja) => (
                        <tr
                          key={loja.id}
                          className="border-b border-gray-200"
                        >
                          <td className="text-left py-2">
                            <a
                              href="#"
                              className="text-gray-900 font-bold hover:text-primary mb-1 text-lg"
                            >
                              {loja.nome_fantasia}
                            </a>
                          </td>
                          <td className="text-center text-gray-500 font-semibold py-2">
                            {loja.razao_social}
                          </td>
                          
                          <td className="text-right py-2">
                            <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                              <FaPencilAlt size={18} />
                            </button>
                            <button
                              onClick={() => {
                                confirmDelete(loja.id);
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
                  pagesInfo={data.GetLojas.pageInfo}
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
    </div>
  );
}