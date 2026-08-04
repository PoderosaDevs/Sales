import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FaReceipt, FaTrash, FaStore, FaBoxOpen } from "react-icons/fa6";
import { useVendas, useDeleteVenda } from "../../hooks/useVendas";
import { useUsuarios } from "../../hooks/useUsuarios";
import { useLojas } from "../../hooks/useLojas";
import { Select, Label } from "../../components/ui/input";
import { DateRangeFilter } from "./DateRangeFilter";
import { StatCard } from "./StatCard";
import { Loader, EmptyState } from "../../components/Loader";
import { formatDateTime, toApiDateParam } from "../../lib/date";
import { extractErrorMessage } from "../../lib/api";
import { TipoPessoa } from "../../types";

const swalConfig = { background: "#0d0d10", color: "#fff", confirmButtonColor: "#10b981", cancelButtonColor: "#334155" };

export function GerenciarVendas() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [lojaId, setLojaId] = useState("");

  const startDate = toApiDateParam(dataInicio);
  const endDate = toApiDateParam(dataFim);

  const { data: funcionarios } = useUsuarios(TipoPessoa.EMPLOYEE);
  const { data: lojas } = useLojas();
  const { data: vendas, isLoading } = useVendas(
    startDate,
    endDate,
    funcionarioId ? Number(funcionarioId) : undefined,
    lojaId ? Number(lojaId) : undefined
  );
  const deleteVenda = useDeleteVenda();

  const totalPontos = useMemo(() => vendas?.reduce((acc, v) => acc + v.pontos_totais, 0) ?? 0, [vendas]);

  const confirmDelete = (vendaId: number, resumo: string) => {
    Swal.fire({
      ...swalConfig,
      title: "Excluir venda?",
      text: `${resumo} — essa ação não pode ser desfeita.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteVenda.mutateAsync(vendaId);
        Swal.fire({ ...swalConfig, icon: "success", title: "Venda excluída!" });
      } catch (error) {
        Swal.fire({ ...swalConfig, icon: "error", title: "Erro", text: extractErrorMessage(error, "Não foi possível excluir.") });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Vendas dos Funcionários</h1>
        </div>
        <DateRangeFilter
          dataInicio={dataInicio}
          dataFim={dataFim}
          onChangeInicio={setDataInicio}
          onChangeFim={setDataFim}
          onClear={() => {
            setDataInicio("");
            setDataFim("");
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="filtro-funcionario">Vendedora</Label>
          <Select id="filtro-funcionario" value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
            <option value="">Todas</option>
            {funcionarios?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filtro-loja">Loja</Label>
          <Select id="filtro-loja" value={lojaId} onChange={(e) => setLojaId(e.target.value)}>
            <option value="">Todas</option>
            {lojas?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome_fantasia}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Vendas no período" value={vendas?.length ?? 0} accent />
        <StatCard label="Pontos gerados" value={totalPontos} />
      </div>

      <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <Loader label="Carregando vendas..." />
        ) : !vendas?.length ? (
          <EmptyState title="Nenhuma venda no período" icon={<FaReceipt size={40} className="text-gray-600" />} />
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {vendas.map((venda) => {
              const produtosResumo = venda.venda_detalhe.map((d) => `${d.quantidade}x ${d.produto?.nome ?? "Produto"}`).join(", ");
              return (
                <div
                  key={venda.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                      <FaReceipt size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold truncate">{venda.funcionario?.nome ?? "—"}</p>
                        <span className="text-gray-600 text-[10px]">•</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <FaStore size={9} className="opacity-50" /> {venda.loja?.nome_fantasia ?? "—"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">{formatDateTime(venda.data_venda)}</p>
                      <p className="text-gray-500 text-xs mt-1.5 flex items-start gap-1.5">
                        <FaBoxOpen size={10} className="opacity-50 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{produtosResumo}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                    <span className="text-emerald-500 font-bold text-sm font-mono">{venda.pontos_totais} pts</span>
                    <button
                      onClick={() => confirmDelete(venda.id, `Venda de ${venda.funcionario?.nome ?? "—"}`)}
                      disabled={deleteVenda.isPending}
                      className="p-3 bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all disabled:opacity-40"
                      title="Excluir venda"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
