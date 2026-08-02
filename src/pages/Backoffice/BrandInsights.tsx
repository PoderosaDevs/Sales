import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPalette, FaStore, FaUserTie } from "react-icons/fa";
import { useMarcaInsights } from "../../hooks/useMarcas";
import { useTimeline } from "../../hooks/useUsuarios";
import { StatCard } from "./StatCard";
import { RankingTable } from "./RankingTable";
import { TimelineChart } from "./TimelineChart";
import { Loader } from "../../components/Loader";

interface MarcaInsight {
  id: number;
  nome: string;
  pontos_totais: number;
  pontos_totais_tratamento: number;
  pontos_totais_coloracao: number;
  lojas: { nome_fantasia: string; pontos_totais: number }[];
  vendedores: { nome: string; quantidade: number }[];
}

export function BrandInsights() {
  const { id } = useParams<{ id: string }>();
  const marcaId = Number(id);
  const { data, isLoading }: { data?: MarcaInsight; isLoading: boolean } = useMarcaInsights(marcaId);
  const { data: timeline, isLoading: timelineLoading } = useTimeline(marcaId, "BRAND");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Link to="/backoffice" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
        <FaArrowLeft size={12} /> Voltar ao painel
      </Link>

      {isLoading ? (
        <Loader label="Carregando desempenho..." />
      ) : !data ? null : (
        <>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
              <FaPalette size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{data.nome}</h1>
              <p className="text-gray-500 text-sm">Desempenho da marca no período</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Pontos no mês" value={data.pontos_totais} accent />
            <StatCard label="Tratamentos" value={data.pontos_totais_tratamento} />
            <StatCard label="Colorações" value={data.pontos_totais_coloracao} />
          </div>

          <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px] mb-6">Evolução no período</h2>
            <TimelineChart data={timeline} isLoading={timelineLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px] mb-6">Lojas com maior volume</h2>
              <RankingTable
                isLoading={false}
                emptyLabel="Sem vendas por loja"
                emptyIcon={<FaStore size={40} className="text-gray-600" />}
                valueLabel="pts"
                rows={data.lojas.map((l, i) => ({ id: i, nome: l.nome_fantasia, valor: l.pontos_totais }))}
              />
            </div>
            <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px] mb-6">Top vendedoras</h2>
              <RankingTable
                isLoading={false}
                emptyLabel="Sem vendas registradas"
                emptyIcon={<FaUserTie size={40} className="text-gray-600" />}
                valueLabel="un."
                rows={data.vendedores.map((v, i) => ({ id: i, nome: v.nome, valor: v.quantidade }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
