import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { QueryGetMetas } from "../../../graphql/Meta/Query";
import { QueryGetFuncionarios } from "../../../graphql/Usuario/Query";
import { Loader } from "../../../components/Loader";

export function Table() {
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  // Estado para controlar o id do usuário com a subtabela visível
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState<
    string | null
  >(null);

  // Query para obter os dados dos usuários
  const { data, loading, error } = QueryGetFuncionarios({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
    },
  });

  // Query para obter as metas do usuário
  const {
    data: metasData,
    loading: metasLoading,
    error: metasError,
  } = QueryGetMetas({
    variables: {
      usuarioId: parseInt(usuarioSelecionadoId!), // Passando o id do usuário selecionado
    },
    skip: !usuarioSelecionadoId, // A query é pulada até o ID ser definido
  });

  // Função para alternar a visibilidade da subtabela
  const toggleSubTabela = (usuarioId: string) => {
    if (usuarioSelecionadoId === usuarioId) {
      // Se a subtabela já estiver visível, fecha-a
      setUsuarioSelecionadoId(null);
    } else {
      // Caso contrário, abre a subtabela do usuário
      setUsuarioSelecionadoId(usuarioId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y border-t-2 divide-gray-200">
        <thead>
          <tr className="border-0">
            <th className="p-0 min-w-36 text-left text-gray-700 py-3">Nome</th>
            <th className="p-0 min-w-28 justify-end flex py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="space-y-1.5">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-3">
                <Loader size={64} hasText={true} sizeDiv="h-[25vh]" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center text-red-500 py-3">
                Erro ao carregar metas: {error.message}
              </td>
            </tr>
          ) : data && data.GetUsuarios.length > 0 ? (
            data.GetUsuarios.map((usuario: any) => (
              <React.Fragment key={usuario.id}>
                <tr className="border-b border-gray-200">
                  <td className="text-left py-3">
                    <a
                      href="#"
                      className="text-gray-900 font-bold hover:text-primary mb-1 text-lg"
                    >
                      {usuario.nome}
                    </a>
                    <span className="text-gray-500 font-semibold block">
                      Meta concluídas:
                    </span>
                  </td>

                  <td className="text-right py-3">
                    <button
                      className="bg-gray-700 text-gray-200 p-4 rounded-xl hover:bg-gray-800 mr-2"
                      onClick={() => toggleSubTabela(usuario.id)} // Alterna a visibilidade ao clicar
                    >
                      Metas
                    </button>
                    <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                      <FaPencilAlt size={18} />
                    </button>
                    <button className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200">
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>

                {/* Tabela de Metas */}
                {usuarioSelecionadoId === usuario.id && (
                  <tr className="border-b border-gray-200">
                    <td colSpan={2} className="py-3">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th className="p-2 text-left text-gray-700">
                              Meta
                            </th>
                            <th className="p-2 text-left text-gray-700">
                              Pontos
                            </th>
                            <th className="p-2 text-right text-gray-700">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Exibe as metas do usuário */}
                          {metasLoading ? (
                            <tr>
                              <td colSpan={2} className="text-center py-2">
                                Carregando metas...
                              </td>
                            </tr>
                          ) : metasError ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center text-red-500 py-2"
                              >
                                Erro ao carregar metas: {metasError.message}
                              </td>
                            </tr>
                          ) : metasData && metasData.GetMetas.length > 0 ? (
                            metasData.GetMetas.map((meta) => (
                              <React.Fragment key={meta.id}>
                                <tr className="border-b border-gray-200">
                                  <td className="p-2 text-gray-700">
                                    {meta.nome}
                                  </td>
                                  <td className="p-2 text-gray-700">
                                    {meta.pontos_objetivo}
                                  </td>
                                  <td className="p-2 text-gray-700 justify-end flex">
                                    <button className="bg-gray-700 text-gray-200 p-4 rounded-xl hover:bg-gray-800 mr-2">
                                      Detalhes
                                    </button>
                                    <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                                      <FaPencilAlt size={18} />
                                    </button>
                                    <button className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200">
                                      <FaTrashAlt size={18} />
                                    </button>
                                  </td>
                                </tr>

                                {/* Exibição das Etapas da Meta */}
                                <tr>
                                  <td colSpan={3}>
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead>
                                        <tr>
                                          <th className="p-2 text-left text-gray-700">
                                            Etapa
                                          </th>
                                          <th className="p-2 text-center text-gray-700">
                                            Recompensa
                                          </th>
                                          <th className="p-2 text-center text-gray-700">
                                            Pontos Necessarios
                                          </th>
                                          <th className="p-2 text-center text-gray-700">
                                            Atingida
                                          </th>
                                          <th className="p-2 text-right text-gray-700">
                                            Importância
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {meta.meta_etapas.length > 0 ? (
                                          meta.meta_etapas.map((etapa) => (
                                            <tr key={etapa.id}>
                                              <td className="p-2 text-gray-700">{`Etapa ${etapa.etapa_numero}`}</td>

                                              <td className="p-2 text-gray-700 text-center">
                                                {etapa.recompensa}
                                              </td>
                                              <td className="p-2 text-gray-700 text-center">
                                                {etapa.valor}
                                              </td>
                                              <td className="p-2 text-gray-700 text-center">
                                                {etapa.atingida ? (
                                                  <span className="bg-green-400 text-green-900 p-1 px-3 rounded">
                                                    Sim
                                                  </span>
                                                ) : (
                                                  <span className="bg-red-400 text-red-900 p-1 px-3 rounded">
                                                    Não
                                                  </span>
                                                )}
                                              </td>

                                              <td className="p-2 text-gray-700 text-end">
                                                {etapa.importancia === 1 && (
                                                  <span className="bg-gray-300 text-gray-800 p-1 rounded">
                                                    Baixo
                                                  </span>
                                                )}
                                                {etapa.importancia === 2 && (
                                                  <span className="bg-blue-500 text-white p-1 rounded">
                                                    Normal
                                                  </span>
                                                )}
                                                {etapa.importancia === 3 && (
                                                  <span className="bg-yellow-500 text-white p-1 rounded">
                                                    Necessario
                                                  </span>
                                                )}
                                                {etapa.importancia === 4 && (
                                                  <span className="bg-orange-500 text-white p-1 rounded">
                                                    Importante
                                                  </span>
                                                )}
                                                {etapa.importancia === 5 && (
                                                  <span className="bg-red-500 text-white p-1 rounded">
                                                    Urgente
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan={6}
                                              className="text-center text-gray-500 py-2"
                                            >
                                              Nenhuma etapa registrada.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={2}
                                className="text-center text-gray-500 py-2"
                              >
                                Nenhuma meta cadastrada.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-3">
                Nenhuma meta cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
