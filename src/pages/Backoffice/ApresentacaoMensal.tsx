import { useMemo, useState } from "react";
import {
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaUserTie,
  FaPalette,
  FaStore,
  FaChartLine,
} from "react-icons/fa6";
import { useRankingUsuarios } from "../../hooks/useUsuarios";
import { useMarcasRanking } from "../../hooks/useMarcas";
import { useLojasRanking } from "../../hooks/useLojas";
import { DateRangeFilter } from "./DateRangeFilter";
import { toApiDateParam } from "../../lib/date";
import { Loader } from "../../components/Loader";

type Secao = "resumo" | "vendedoras" | "marcas" | "lojas";

const SECOES: { id: Secao; label: string; icon: typeof FaUserTie }[] = [
  { id: "resumo", label: "Resumo Geral", icon: FaChartLine },
  { id: "vendedoras", label: "Ranking de Vendedoras", icon: FaUserTie },
  { id: "marcas", label: "Ranking de Marcas", icon: FaPalette },
  { id: "lojas", label: "Ranking de Lojas", icon: FaStore },
];

export function ApresentacaoMensal({ onClose }: { onClose: () => void }) {
  const [etapa, setEtapa] = useState<"config" | "apresentacao">("config");
  const [modo, setModo] = useState<"geral" | "personalizada">("geral");
  const [secoesSelecionadas, setSecoesSelecionadas] = useState<Secao[]>(["resumo", "vendedoras", "marcas", "lojas"]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [slideAtual, setSlideAtual] = useState(0);

  const startDate = toApiDateParam(dataInicio);
  const endDate = toApiDateParam(dataFim);

  const { data: rankingUsuarios, isLoading: loadingUsuarios } = useRankingUsuarios(startDate, endDate);
  const { data: rankingMarcas, isLoading: loadingMarcas } = useMarcasRanking(startDate, endDate);
  const { data: rankingLojas, isLoading: loadingLojas } = useLojasRanking(startDate, endDate);

  const isLoading = loadingUsuarios || loadingMarcas || loadingLojas;

  const secoesAtivas = modo === "geral" ? (["resumo", "vendedoras", "marcas", "lojas"] as Secao[]) : secoesSelecionadas;
  const slides = SECOES.filter((s) => secoesAtivas.includes(s.id));

  const periodoLabel = useMemo(() => {
    if (!dataInicio && !dataFim) return "Mês atual";
    const fmt = (v: string) => (v ? v.split("-").reverse().join("/") : "…");
    return `${fmt(dataInicio)} — ${fmt(dataFim)}`;
  }, [dataInicio, dataFim]);

  const toggleSecao = (id: Secao) => {
    setSecoesSelecionadas((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const totalPontos = rankingUsuarios?.reduce((acc, u) => acc + u.pontos_totais, 0) ?? 0;
  const vendedorasAtivas = rankingUsuarios?.filter((u) => u.pontos_totais > 0).length ?? 0;
  const topVendedora = rankingUsuarios?.[0];
  const topMarca = rankingMarcas?.[0];
  const topLoja = rankingLojas?.[0];

  const iniciarApresentacao = () => {
    if (slides.length === 0) return;
    setSlideAtual(0);
    setEtapa("apresentacao");
  };

  const proximo = () => setSlideAtual((s) => Math.min(s + 1, slides.length - 1));
  const anterior = () => setSlideAtual((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0c] text-white flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-emerald-500" size={20} />
          <span className="font-black uppercase tracking-[3px] text-sm text-white">Apresentação Mensal</span>
          {etapa === "apresentacao" && <span className="text-gray-500 text-sm ml-2">· {periodoLabel}</span>}
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-red-500 text-gray-300 hover:text-white rounded-2xl transition-all"
          aria-label="Fechar apresentação"
        >
          <FaXmark size={20} />
        </button>
      </div>

      {etapa === "config" ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16 space-y-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Configurar apresentação</h1>
              <p className="text-gray-400 text-base mt-2">Escolha o período e o que você quer mostrar.</p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[2px] text-gray-500">Período</p>
              <DateRangeFilter
                dataInicio={dataInicio}
                dataFim={dataFim}
                onChangeInicio={setDataInicio}
                onChangeFim={setDataFim}
                onClear={() => {
                  setDataInicio("");
                  setDataFim("");
                }}
                label="Mostrar dados de"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[2px] text-gray-500">Modo</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setModo("geral")}
                  className={`text-left p-6 rounded-3xl border transition-all ${
                    modo === "geral" ? "bg-emerald-500/10 border-emerald-500/50" : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <p className="text-white font-bold text-lg">Apresentação Geral</p>
                  <p className="text-gray-400 text-sm mt-1">Mostra tudo: resumo, vendedoras, marcas e lojas.</p>
                </button>
                <button
                  onClick={() => setModo("personalizada")}
                  className={`text-left p-6 rounded-3xl border transition-all ${
                    modo === "personalizada" ? "bg-emerald-500/10 border-emerald-500/50" : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <p className="text-white font-bold text-lg">Apresentação Personalizada</p>
                  <p className="text-gray-400 text-sm mt-1">Você escolhe quais seções entram.</p>
                </button>
              </div>
            </div>

            {modo === "personalizada" && (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[2px] text-gray-500">Seções</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SECOES.map((secao) => {
                    const ativo = secoesSelecionadas.includes(secao.id);
                    return (
                      <button
                        key={secao.id}
                        onClick={() => toggleSecao(secao.id)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
                          ativo ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <secao.icon size={20} />
                        <span className="text-xs font-bold uppercase tracking-wide text-center">{secao.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={iniciarApresentacao}
              disabled={slides.length === 0}
              className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-[3px] transition-all shadow-lg shadow-emerald-900/20"
            >
              Iniciar apresentação
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader label="Preparando apresentação..." />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center px-6 md:px-16 py-10">
            <div className="w-full max-w-5xl">
              {slides[slideAtual]?.id === "resumo" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <p className="text-emerald-500 font-black uppercase tracking-[4px] text-sm text-center">Resumo do período</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                      <p className="text-5xl md:text-6xl font-black text-emerald-500">{totalPontos}</p>
                      <p className="text-gray-300 text-base font-bold uppercase tracking-widest mt-3">Pontos no período</p>
                    </div>
                    <div className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                      <p className="text-5xl md:text-6xl font-black text-white">{vendedorasAtivas}</p>
                      <p className="text-gray-300 text-base font-bold uppercase tracking-widest mt-3">Vendedoras ativas</p>
                    </div>
                    <div className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                      <p className="text-5xl md:text-6xl font-black text-white">{rankingLojas?.length ?? 0}</p>
                      <p className="text-gray-300 text-base font-bold uppercase tracking-widest mt-3">Lojas no período</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <DestaqueCard icon={FaUserTie} titulo="Top vendedora" nome={topVendedora?.nome} valor={topVendedora?.pontos_totais} unidade="pts" />
                    <DestaqueCard icon={FaPalette} titulo="Top marca" nome={topMarca?.nome} valor={topMarca?.total_vendas} unidade="un." />
                    <DestaqueCard icon={FaStore} titulo="Top loja" nome={topLoja?.nome_fantasia} valor={topLoja?.total_vendas} unidade="un." />
                  </div>
                </div>
              )}

              {slides[slideAtual]?.id === "vendedoras" && (
                <BigRanking
                  titulo="Ranking de Vendedoras"
                  subtitulo="Top performers"
                  icon={FaUserTie}
                  unidade="pts"
                  rows={rankingUsuarios?.map((u) => ({
                    nome: u.nome,
                    valor: u.pontos_totais,
                    tratamento: u.pontos_totais_tratamento,
                    coloracao: u.pontos_totais_coloracao,
                  }))}
                />
              )}

              {slides[slideAtual]?.id === "marcas" && (
                <BigRanking
                  titulo="Ranking de Marcas"
                  subtitulo="Share de mercado"
                  icon={FaPalette}
                  unidade="un."
                  rows={rankingMarcas?.map((m) => ({
                    nome: m.nome,
                    valor: m.total_vendas,
                    tratamento: m.total_tratamento,
                    coloracao: m.total_coloracao,
                  }))}
                />
              )}

              {slides[slideAtual]?.id === "lojas" && (
                <BigRanking
                  titulo="Ranking de Lojas"
                  subtitulo="Performance por unidade"
                  icon={FaStore}
                  unidade="un."
                  rows={rankingLojas?.map((l) => ({
                    nome: l.nome_fantasia,
                    valor: l.total_vendas,
                    tratamento: l.total_tratamento,
                    coloracao: l.total_coloracao,
                  }))}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 px-6 md:px-10 py-6 border-t border-white/10 flex-shrink-0">
            <button
              onClick={anterior}
              disabled={slideAtual === 0}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
            >
              <FaChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSlideAtual(i)}
                  className={`h-2 rounded-full transition-all ${i === slideAtual ? "w-8 bg-emerald-500" : "w-2 bg-white/15 hover:bg-white/30"}`}
                  aria-label={`Ir para slide ${s.label}`}
                />
              ))}
            </div>
            <button
              onClick={proximo}
              disabled={slideAtual === slides.length - 1}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DestaqueCard({
  icon: Icon,
  titulo,
  nome,
  valor,
  unidade,
}: {
  icon: typeof FaUserTie;
  titulo: string;
  nome?: string;
  valor?: number;
  unidade: string;
}) {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 flex-shrink-0">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{titulo}</p>
        <p className="text-white font-bold text-lg truncate">{nome ?? "Sem dados"}</p>
        {valor !== undefined && (
          <p className="text-emerald-500 font-bold text-sm mt-0.5">
            {valor} {unidade}
          </p>
        )}
      </div>
    </div>
  );
}

function BigRanking({
  titulo,
  subtitulo,
  icon: Icon,
  unidade,
  rows,
}: {
  titulo: string;
  subtitulo: string;
  icon: typeof FaUserTie;
  unidade: string;
  rows?: { nome: string; valor: number; tratamento?: number; coloracao?: number }[];
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-center gap-3">
        <Icon className="text-emerald-500" size={24} />
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-black text-white">{titulo}</p>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[3px] mt-1">{subtitulo}</p>
        </div>
      </div>

      {!rows?.length ? (
        <p className="text-center text-gray-500 text-base py-12">Sem dados no período selecionado.</p>
      ) : (
        <div className="space-y-4">
          {rows.slice(0, 8).map((row, index) => (
            <div key={row.nome + index} className="flex items-center gap-5">
              <span
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-base ${
                  index === 0 ? "bg-emerald-500 text-[#0a0a0c]" : "bg-white/10 text-gray-300"
                }`}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-white font-bold text-lg truncate">{row.nome}</span>
                  <span className="text-emerald-500 font-black text-lg font-mono flex-shrink-0">
                    {row.valor} <span className="text-gray-500 text-sm font-sans">{unidade}</span>
                  </span>
                </div>
                {(row.tratamento !== undefined || row.coloracao !== undefined) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold whitespace-nowrap">
                      Tratamento {row.tratamento ?? 0}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold whitespace-nowrap">
                      Coloração {row.coloracao ?? 0}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
