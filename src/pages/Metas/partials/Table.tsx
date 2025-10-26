import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { QueryGetMetas, useConfirmDeleteMeta } from "../../../graphql/Meta/Query";
import { QueryGetFuncionarios } from "../../../graphql/Usuario/Query";
import { Loader } from "../../../components/Loader";

export function Table() {
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  // Usuário cuja lista de metas está visível
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState<string | null>(null);

  // Meta cuja subtabela de etapas está visível
  const [metaSelecionadaId, setMetaSelecionadaId] = useState<string | null>(null);

  /* ---------- Queries ---------- */
  const { data, loading, error } = QueryGetFuncionarios({
    variables: { pagination: paginacao },
  });

  const { confirmAndDelete } = useConfirmDeleteMeta();

  const {
    data: metasData,
    loading: metasLoading,
    error: metasError,
  } = QueryGetMetas({
    variables: { usuarioId: parseInt(usuarioSelecionadoId!) },
    skip: !usuarioSelecionadoId,
  });

  /* ---------- Toggles ---------- */
  const toggleSubTabelaUsuario = (id: string) => {
    // fecha as metas de outro usuário e limpa subtabela de etapas
    setUsuarioSelecionadoId((prev) => (prev === id ? null : id));
    setMetaSelecionadaId(null);
  };

  const toggleSubTabelaEtapas = (metaId: string) => {
    setMetaSelecionadaId((prev) => (prev === metaId ? null : metaId));
  };

  /* ---------- JSX ---------- */
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto divide-y border-t-2 divide-gray-200">
        {/* Cabeçalho */}
        <thead>
          <tr>
            <th className="min-w-36 text-left text-gray-700 py-3 px-3">Nome</th>
            <th className="min-w-28 text-right text-gray-700 py-3 px-3">Ações</th>
          </tr>
        </thead>

        <tbody>
          {/* Loader / Erro global */}
          {loading ? (
            <tr>
              <td colSpan={2} className="text-center py-6">
                <Loader size={64} hasText sizeDiv="h-[25vh]" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={2} className="text-center text-red-500 py-6">
                Erro ao carregar usuários: {error.message}
              </td>
            </tr>
          ) : data && data.GetUsuarios.length > 0 ? (
            /* ---------- Lista de usuários ---------- */
            data.GetUsuarios.map((usuario: any) => (
              <React.Fragment key={usuario.id}>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-3">
                    <span className="text-gray-900 font-bold text-lg">
                      {usuario.nome}
                    </span>
                    {/* <span className="text-gray-500 font-semibold block">
                      Metas concluídas:
                    </span> */}
                  </td>
                  <td className="py-4 px-3 text-right space-x-2">
                    <button
                      className="bg-gray-700 text-gray-200 p-3 rounded-xl hover:bg-gray-800"
                      onClick={() => toggleSubTabelaUsuario(usuario.id)}
                    >
                      Metas
                    </button>
                   
                  </td>
                </tr>

                {/* ---------- Subtabela de Metas ---------- */}
                {usuarioSelecionadoId === usuario.id && (
                  <tr className="border-b border-gray-200">
                    <td colSpan={2} className="py-4 px-3">
                      <table className="w-full table-auto divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th className="p-2 text-left text-gray-700">Meta</th>
                            <th className="p-2 text-center text-gray-700">Atual</th>
                            <th className="p-2 text-center text-gray-700">Objetivo</th>
                            <th className="p-2 text-right text-gray-700">Ações</th>
                          </tr>
                        </thead>

                        <tbody>
                          {metasLoading ? (
                            <tr>
                              <td colSpan={4} className="text-center py-4">
                                Carregando metas...
                              </td>
                            </tr>
                          ) : metasError ? (
                            <tr>
                              <td colSpan={4} className="text-center text-red-500 py-4">
                                Erro ao carregar metas: {metasError.message}
                              </td>
                            </tr>
                          ) : metasData && metasData.GetMetas.length > 0 ? (
                            metasData.GetMetas.map((meta: any) => (
                              <React.Fragment key={meta.id}>
                                {/* Linha da meta */}
                                <tr className="border-b border-gray-200">
                                  <td className="p-2 text-gray-700">{meta.nome}</td>
                                  <td className="p-2 text-center text-gray-700">
                                    {meta.quantidade_atual}
                                  </td>
                                  <td className="p-2 text-center text-gray-700">
                                    {meta.quantidade_objetivo}
                                  </td>
                                  <td className="p-2 text-right text-gray-700 space-x-2">
                                    {meta.meta_etapas.length > 0 && (
                                      <button
                                        className="bg-gray-700 text-gray-200 p-3 rounded-xl hover:bg-gray-800"
                                        onClick={() => toggleSubTabelaEtapas(meta.id)}
                                      >
                                        Detalhes
                                      </button>
                                    )}
                                    <button className="bg-green-100 text-green-600 p-3 rounded-xl hover:bg-green-200">
                                      <FaPencilAlt size={18} />
                                    </button>
                                    <button onClick={() => confirmAndDelete(meta.id)} className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200">
                                      <FaTrashAlt size={18} />
                                    </button>
                                  </td>
                                </tr>

                                {/* ---------- Subtabela de Etapas ---------- */}
                                {metaSelecionadaId === meta.id && (
                                  <tr>
                                    <td colSpan={4} className="px-2 pb-4">
                                      <table className="w-full table-auto divide-y divide-gray-200">
                                        <thead>
                                          <tr>
                                            <th className="p-2 text-left text-gray-700">Etapa</th>
                                            <th className="p-2 text-center text-gray-700">Nome</th>
                                            <th className="p-2 text-center text-gray-700">Pontos Atuais</th>
                                            <th className="p-2 text-center text-gray-700">Pontos Necessários</th>
                                            <th className="p-2 text-center text-gray-700">Atingida</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {meta.meta_etapas.map((etapa: any, idx: number) => (
                                            <tr key={etapa.id}>
                                              <td className="p-2 text-gray-700">
                                                {`Etapa ${idx + 1}/${meta.meta_etapas.length}`}
                                              </td>
                                              <td className="p-2 text-center text-gray-700">
                                                {etapa.nome}
                                              </td>
                                              <td className="p-2 text-center text-gray-700">
                                                {etapa.quantidade_atual}
                                              </td>
                                              <td className="p-2 text-center text-gray-700">
                                                {etapa.quantidade_objetivo}
                                              </td>
                                              <td className="p-2 text-center text-gray-700">
                                                {etapa.atingida ? (
                                                  <span className="bg-green-400 text-green-900 px-3 py-1 rounded">
                                                    Sim
                                                  </span>
                                                ) : (
                                                  <span className="bg-red-400 text-red-900 px-3 py-1 rounded">
                                                    Não
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center text-gray-500 py-4">
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
              <td colSpan={2} className="text-center text-gray-500 py-6">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
