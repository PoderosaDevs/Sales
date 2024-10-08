import React from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { QueryGetMetas } from "../../../graphql/Meta/Query";
import { Loader } from "../../../components/Loader";

export function Table() {
  const { data, error, loading } = QueryGetMetas();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y border-t-2 divide-gray-200">
        <thead>
          <tr className="border-0">
            <th className="p-0 min-w-36 text-left text-gray-700 py-3">Descrição</th>
            <th className="p-0 min-w-36 text-gray-700 text-center py-3">Quantidade</th>
            <th className="p-0 min-w-36 text-gray-700 text-center py-3">Marca</th>
            <th className="p-0 min-w-36 text-gray-700 text-center py-3">Periodo</th>
            <th className="p-0 min-w-36 text-gray-700 text-center py-3">Situação</th>
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
          ) : data && data.GetMetas.length > 0 ? (
            data.GetMetas.map((meta: any) => (
              <tr key={meta.id} className="border-b border-gray-200">
                <td className="text-left py-3">
                  <a href="#" className="text-gray-900 font-bold hover:text-primary mb-1 text-lg">
                    {meta.descricao}
                  </a>
                  <span className="text-gray-500 font-semibold block">Meta relacionada</span>
                </td>
                <td className="text-center text-gray-500 font-semibold py-3">{meta.quantidade_total}</td>
                <td className="text-center text-gray-500 font-semibold py-3">{meta.marca}</td>
                <td className="text-center py-3">
                  {meta.data_inicio} - {meta.data_fim}
                </td>
                <td className="text-center py-3">
                  <span
                    className={`inline-block ${meta.situacao === 'Ativo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                      } py-2 px-3 rounded-full text-xs font-medium`}
                  >
                    {meta.situacao}
                  </span>
                </td>
                <td className="text-right py-3">
                  <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2">
                    <FaPencilAlt size={18} />
                  </button>
                  <button className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200">
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
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
