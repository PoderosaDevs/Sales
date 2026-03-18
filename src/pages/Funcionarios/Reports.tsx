import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, DownloadSimple, Funnel } from "phosphor-react";
import { TbReportAnalytics } from "react-icons/tb";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR_locale from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import {
  subDays,
  isWeekend,
  eachDayOfInterval,
  getMonth,
  getYear,
} from "date-fns";
import { CSVLink } from "react-csv";
import { QueryGetVendas } from "../../graphql/Venda/Query";
import { GeVendasTypes } from "../../graphql/Venda/Types";
import { BounceLoader } from "react-spinners";

// Registra o idioma para o DatePicker
registerLocale("pt-BR", ptBR_locale);

export function RelatorioModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [vendas, setVendas] = useState<GeVendasTypes["GetVendas"]>([]);
  const [vendasEncontradas, setVendasEncontradas] = useState(false);

  const { getVendasData, loading } = QueryGetVendas({
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
    const firstDayOfLastMonth = new Date(getYear(currentDate), getMonth(currentDate) - 1, 1);
    const lastDayOfLastMonth = new Date(getYear(currentDate), getMonth(currentDate), 0);
    const workingDays = filtrarDiasUteis(firstDayOfLastMonth, lastDayOfLastMonth);
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
          if (response.data?.GetVendas && response.data.GetVendas.length > 0) {
            setVendas(response.data.GetVendas);
            setVendasEncontradas(true);
          } else {
            setVendas([]);
            setVendasEncontradas(false);
            Swal.fire({
              icon: "info",
              title: "Sem registros",
              text: "Nenhuma venda encontrada no período selecionado.",
              background: "#0d0d10",
              color: "#fff",
            });
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
    const sourceData = vendas.length > 0 ? vendas : [];
    const csvHeaders = [
      { label: "ID Venda", key: "id_venda" },
      { label: "Funcionário", key: "funcionario" },
      { label: "Produto Nome", key: "produto_nome" },
      { label: "Pontos Produto", key: "pontos_produto" },
      { label: "Quantidade Vendida", key: "quantidade_vendida" },
      { label: "Pontos Totais Venda", key: "pontos_totais_venda" },
    ];

    const csvData = sourceData.flatMap((venda) =>
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
  }, [vendas]);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Dados Incompletos",
        text: "Selecione o intervalo de datas para análise.",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
      return;
    }
    filtrarVendas();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
          <TbReportAnalytics size={20} />
          Exportar Relatórios
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none overflow-hidden">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              <Dialog.Title className="text-xl font-bold text-white uppercase tracking-wider">
                Extração de Dados
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </Dialog.Close>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateReport();
            }}
            className="space-y-8"
          >
            {/* Seleção de Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-emerald-500" /> Data Início
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date as Date)}
                  selectsStart
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  placeholderText="00/00/0000"
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-emerald-500" /> Data Fim
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date as Date)}
                  selectsEnd
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  minDate={startDate ?? undefined}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  placeholderText="00/00/0000"
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                />
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="space-y-3">
               <label className="text-[9px] font-black text-gray-600 uppercase tracking-[3px] ml-1">Atalhos de Período</label>
               <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={setUltimaSemana} className="py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:bg-white/10 hover:text-white transition-all">Última Semana</button>
                <button type="button" onClick={setUltimoMes} className="py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:bg-white/10 hover:text-white transition-all">Último Mês</button>
                <button type="button" onClick={setUltimosTresMeses} className="py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:bg-white/10 hover:text-white transition-all">90 Dias</button>
              </div>
            </div>

            {/* Ações Principais */}
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white/5 hover:bg-white/10 text-emerald-500 border border-emerald-500/20 rounded-3xl font-black text-[11px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? <BounceLoader color="#10b981" size={20} /> : (
                  <>
                    <Funnel size={16} weight="bold" />
                    {vendasEncontradas ? "Atualizar Busca" : "Localizar Vendas"}
                  </>
                )}
              </button>

              {vendasEncontradas && (
                <div className="animate-in zoom-in-95 duration-300">
                   <CSVLink
                    data={dataForCSV.data}
                    headers={dataForCSV.headers}
                    filename={`relatorio_vendas_${new Date().toISOString().slice(0, 10)}.csv`}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40"
                    separator=";"
                  >
                    <DownloadSimple size={18} weight="bold" />
                    Baixar Arquivo CSV
                  </CSVLink>
                  <p className="text-center text-gray-600 text-[9px] mt-4 uppercase font-bold tracking-widest">
                    {vendas.length} registros prontos para exportação
                  </p>
                </div>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}