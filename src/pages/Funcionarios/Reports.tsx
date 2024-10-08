import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { TbReportAnalytics } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDays,
  subDays,
  isWeekend,
  eachDayOfInterval,
  getMonth,
  getYear,
} from "date-fns";
import { CSVLink } from "react-csv";
import { QueryGetVendas } from "../../graphql/Venda/Query";
import { GeVendasTypes } from "../../graphql/Venda/Types";

export function RelatorioModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [vendas, setVendas] = useState<GeVendasTypes["GetVendas"]>([]);
  const [vendasEncontradas, setVendasEncontradas] = useState(false);

  const { getVendasData, data, loading, error } = QueryGetVendas({
    variables: {
      startDate,
      endDate,
    },
  });

  const filtrarDiasUteis = (start: Date, end: Date) => {
    return eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day));
  };

  const setUltimoMes = () => {
    const currentDate = new Date();
    const firstDayOfLastMonth = new Date(
      getYear(currentDate),
      getMonth(currentDate) - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      getYear(currentDate),
      getMonth(currentDate),
      0
    );

    const workingDays = filtrarDiasUteis(
      firstDayOfLastMonth,
      lastDayOfLastMonth
    );

    setStartDate(workingDays[0] || null);
    setEndDate(workingDays[workingDays.length - 1] || null);
  };

  const setUltimaSemana = () => {
    const currentDate = new Date();
    const lastWeekStart = subDays(currentDate, 7);

    const workingDays = filtrarDiasUteis(lastWeekStart, currentDate);

    setStartDate(workingDays[0] || null);
    setEndDate(workingDays[workingDays.length - 1] || null);
  };

  const setUltimosTresMeses = () => {
    const currentDate = new Date();
    const threeMonthsAgo = subDays(currentDate, 90);

    const workingDays = filtrarDiasUteis(threeMonthsAgo, currentDate);

    setStartDate(workingDays[0] || null);
    setEndDate(workingDays[workingDays.length - 1] || null);
  };

  const filtrarVendas = () => {
    if (startDate && endDate) {
      getVendasData({
        variables: { startDate, endDate },
      })
        .then((response) => {
          if (
            response.data &&
            response.data.GetVendas &&
            response.data.GetVendas.length > 0
          ) {
            setVendas(response.data.GetVendas);
            setVendasEncontradas(true);
          } else {
            setVendas([]);
            setVendasEncontradas(false);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar vendas:", error);
          setVendas([]);
          setVendasEncontradas(false);
        });
    }
  };

  const dataForCSV = useMemo(() => {
    if (data?.GetVendas) {
      const csvHeaders = [
        { label: "ID Venda", key: "id_venda" },
        { label: "Funcionário", key: "funcionario" },
        { label: "Produto Nome", key: "produto_nome" },
        { label: "Pontos Produto", key: "pontos_produto" },
        { label: "Quantidade Vendida", key: "quantidade_vendida" },
        { label: "Pontos Totais Venda", key: "pontos_totais_venda" },
      ];

      const csvData = data.GetVendas.flatMap((venda) =>
        venda.venda_detalhe?.map((detail) => ({
          id_venda: venda.id,
          funcionario: venda.funcionario.nome,
          produto_nome: detail.produto?.nome || "Produto não definido",
          pontos_produto: detail.pontos || 0,
          quantidade_vendida: detail.quantidade || 0,
          pontos_totais_venda: venda.pontos_totais || 0,
        })) || []
      );

      return { headers: csvHeaders, data: csvData };
    }
    return { headers: [], data: [] };
  }, [data]);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Selecione um intervalo de datas válido.",
      });
      return;
    }

    filtrarVendas();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-3 bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 rounded-xl">
          <TbReportAnalytics size={20} />
          {vendasEncontradas ? "Gerar Relatório" : "Buscar Vendas"}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
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
              className="text-xl font-semibold mb-4"
            >
              {vendasEncontradas ? "Gerar Relatório" : "Buscar Vendas"}
            </Dialog.Title>
            <div className="border w-full mb-6" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateReport();
              }}
              className="space-y-6"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm">
                      Data Início
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date as Date)}
                      selectsStart
                      startDate={startDate ?? undefined}
                      endDate={endDate ?? undefined}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm">
                      Data Fim
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date as Date)}
                      selectsEnd
                      startDate={startDate ?? undefined}
                      endDate={endDate ?? undefined}
                      minDate={startDate ?? undefined}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={setUltimoMes}
                  >
                    Último Mês
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={setUltimaSemana}
                  >
                    Última Semana
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    onClick={setUltimosTresMeses}
                  >
                    Últimos 3 Meses
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Gerar Relatório
                </button>
              </div>

              {vendasEncontradas && (
                <div className="mt-6 text-center">
                  <CSVLink
                    data={dataForCSV.data}
                    headers={dataForCSV.headers}
                    filename={`relatorio_vendas_${new Date()
                      .toISOString()
                      .slice(0, 10)}.csv`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    separator=";"
                  >
                    Download CSV
                  </CSVLink>
                </div>
              )}
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
