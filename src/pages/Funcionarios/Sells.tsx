import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { formatDateToString } from "../../utils/dateUtils";
import { MutationDeleteVenda } from "../../graphql/Venda/Mutation";
import Swal from "sweetalert2";

interface Props {
  idUser: string;
}

interface Venda {
  id: number;
  data_venda: string;
  pontos_totais: number;
  venda_detalhe: {
    produto: {
      id: number;
      nome: string;
      imagem: string;
    };
    pontos: number;
    quantidade: number; // Adicionei o campo quantidade que estava faltando
  }[];
}

export function VendasUsuarioModal({ idUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, loading, error } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: parseInt(idUser),
    },
  });

  const vendas = Array.isArray(data?.GetVendaByUsuarioID)
    ? data.GetVendaByUsuarioID
    : [];

  // Função para filtrar vendas por data
  const filteredVendas = vendas.filter((venda) => {
    const vendaDate = new Date(venda.data_venda);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return vendaDate >= start && vendaDate <= end;
    }

    if (start) {
      return vendaDate >= start;
    }

    if (end) {
      return vendaDate <= end;
    }

    return true; // Se não houver filtros de data, retorna todas as vendas
  });

  const handleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const { FormDeleteVenda } = MutationDeleteVenda(parseInt(idUser));

  async function confirmDelete(id: number) {
  // Fecha o modal primeiro
  setIsOpen(false);

  // Aguarda a animação/render do Dialog fechar
  setTimeout(async () => {
    const confirm = await Swal.fire({
      title: "Tem certeza que deseja excluir?",
      text: "Esta ação não poderá ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      backdrop: true, // Garante o backdrop do próprio swal
    });

    if (confirm.isConfirmed) {
      try {
        Swal.fire({
          title: "Excluindo...",
          text: "Por favor, aguarde.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const result = await FormDeleteVenda(id);

        if (!result) {
          Swal.fire("Erro!", "Erro ao excluir o registro.", "error");
        } else {
          Swal.fire("Sucesso!", "Registro excluído com sucesso.", "success");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erro!", "Ocorreu um erro inesperado.", "error");
      }
    } else {
      // Reabre o modal se cancelado
      setIsOpen(true);
    }
  }, 150); // tempo ideal para o modal do Radix fechar (ajustável)
}


  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="p-4 bg-custom-bg-start text-white font-semibold rounded-xl mr-2">
          <TbReportAnalytics size={20} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-white rounded-lg shadow-lg p-6 w-full px-10 max-w-[1000px] max-h-[80vh] overflow-auto z-[600]"
            aria-labelledby="dialog-title"
          >
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-300"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            <Dialog.Title
              id="dialog-title"
              className="text-xl font-semibold border-none shadow-none mb-4"
            >
              Vendas do Usuário
            </Dialog.Title>
            <div className="border w-full" />

            {/* Filtros de Data */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Data Início:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Data Fim:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-0">
                    <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                      ID
                    </th>
                    <th className="p-0 min-w-36 text-left text-gray-700 py-3">
                      Data Venda
                    </th>
                    <th className="p-0 min-w-36 text-gray-700 text-left py-3">
                      Pontos Totais
                    </th>
                    <th className="p-0 min-w-28 justify-end flex py-3">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="space-y-1.5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10">
                        Carregando...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-red-500"
                      >
                        Erro ao carregar as vendas: {error.message}
                      </td>
                    </tr>
                  ) : filteredVendas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-gray-500"
                      >
                        Nenhuma venda encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredVendas.map((venda) => (
                      <React.Fragment key={venda.id}>
                        <tr className="border-b border-gray-200">
                          <td className="flex text-center py-2">{venda.id}</td>
                          <td className="text-left py-2">
                            {formatDateToString(venda.data_venda)}
                          </td>
                          <td className="text-left">
                            <span className="text-gray-500 font-semibold block">
                              {venda.pontos_totais}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            <button
                              onClick={() => handleExpand(venda.id)}
                              className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-200 mr-2"
                            >
                              <FaBoxesStacked size={18} />
                            </button>
                            <button
                              onClick={() => {
                                confirmDelete(venda.id);
                              }}
                              className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-200"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          </td>
                        </tr>
                        {expandedRow === venda.id && (
                          <tr>
                            <td colSpan={5} className="py-2">
                              <div className="bg-gray-100 p-4 rounded">
                                <h4 className="text-lg font-semibold mb-2">
                                  Produtos da Venda:
                                </h4>
                                <ul>
                                  {venda.venda_detalhe.map((detail, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center py-1"
                                    >
                                      <img
                                        src={detail.produto.imagem}
                                        alt={detail.produto.nome}
                                        className="w-16 h-16 object-cover mr-4"
                                      />
                                      <div>
                                        <div className="font-medium">
                                          {detail.produto.nome}
                                        </div>
                                        <div className="text-gray-500">
                                          Pontos: {detail.pontos}
                                        </div>
                                        <div className="text-gray-500">
                                          Quantidade: {detail.quantidade}
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
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
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
