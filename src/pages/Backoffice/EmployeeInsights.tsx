import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaUserTie, FaPalette, FaStore } from "react-icons/fa";
import { useUsuarioInsights, useTimeline } from "../../hooks/useUsuarios";
import { StatCard } from "./StatCard";
import { RankingTable } from "./RankingTable";
import { TimelineChart } from "./TimelineChart";
import { Loader } from "../../components/Loader";

export function EmployeeInsights() {
  const { id } = useParams<{ id: string }>();
  const usuarioId = Number(id);
  const { data, isLoading } = useUsuarioInsights(usuarioId);
  const { data: timeline, isLoading: timelineLoading } = useTimeline(usuarioId, "USER");

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
              <FaUserTie size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{data.nome}</h1>
              <p className="text-gray-500 text-sm">{data.email}</p>
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
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px] mb-6">Marcas mais vendidas</h2>
              <RankingTable
                isLoading={false}
                emptyLabel="Sem vendas por marca"
                emptyIcon={<FaPalette size={40} className="text-gray-600" />}
                valueLabel="un."
                rows={data.marcas.map((m, i) => ({ id: i, nome: m.nome, valor: m.quantidade }))}
              />
            </div>
            <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[3px] mb-6">Lojas atendidas</h2>
              <RankingTable
                isLoading={false}
                emptyLabel="Sem vendas por loja"
                emptyIcon={<FaStore size={40} className="text-gray-600" />}
                valueLabel="un."
                rows={data.lojas.map((l) => ({ id: l.id, nome: l.nome, valor: l.quantidade }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
