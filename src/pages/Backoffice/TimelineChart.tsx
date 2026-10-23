import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TimelinePonto, TimelineParcial } from "../../hooks/useUsuarios";
import { Loader, EmptyState } from "../../components/Loader";
import { FaChartLine, FaStore, FaUserTie } from "react-icons/fa";

type Detalhe = "lojas" | "vendedores";

interface Props {
  data?: TimelinePonto[];
  isLoading: boolean;
  detalhe?: Detalhe;
}

const detalheConfig: Record<Detalhe, { titulo: string; icon: JSX.Element }> = {
  lojas: { titulo: "Lojas", icon: <FaStore size={10} /> },
  vendedores: { titulo: "Vendedoras", icon: <FaUserTie size={10} /> },
};

export function TimelineChart({ data, isLoading, detalhe }: Props) {
  if (isLoading) return <Loader label="Carregando série histórica..." />;
  if (!data?.length) return <EmptyState title="Sem dados no período" icon={<FaChartLine size={40} className="text-gray-600" />} />;

  const chartData = data.map((ponto) => {
    const row: Record<string, unknown> = { data: ponto.data, detalhe: detalhe ? ponto[detalhe] ?? [] : [] };
    ponto.categories.forEach((c) => (row[c.title] = c.value));
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="data" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const itens = (payload[0].payload.detalhe ?? []) as TimelineParcial[];
            return (
              <div style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, padding: "10px 12px", maxWidth: 280 }}>
                <p className="text-white font-bold mb-1">{label}</p>
                {payload.map((p) => (
                  <p key={String(p.dataKey)} style={{ color: p.color }}>
                    {p.name}: {p.value}
                  </p>
                ))}
                {detalhe && itens.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                    <p className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                      {detalheConfig[detalhe].icon} {detalheConfig[detalhe].titulo}
                    </p>
                    {itens.map((item) => (
                      <p key={item.id} className="flex items-center justify-between gap-4 text-gray-300">
                        <span className="truncate">{item.nome}</span>
                        <span className="flex-shrink-0">
                          <span style={{ color: "#10b981" }}>{item.tratamentos}</span>
                          <span className="text-gray-600"> / </span>
                          <span style={{ color: "#f59e0b" }}>{item.coloracoes}</span>
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }} />
        <Line type="monotone" name="Tratamentos" dataKey="tratamentos" stroke="#10b981" strokeWidth={2} dot={false} />
        <Line type="monotone" name="Colorações" dataKey="coloracoes" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
