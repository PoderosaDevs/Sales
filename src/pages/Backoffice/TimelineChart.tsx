import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TimelinePonto } from "../../hooks/useUsuarios";
import { Loader, EmptyState } from "../../components/Loader";
import { FaChartLine, FaStore } from "react-icons/fa";

interface Props {
  data?: TimelinePonto[];
  isLoading: boolean;
  showLojas?: boolean;
}

export function TimelineChart({ data, isLoading, showLojas = false }: Props) {
  if (isLoading) return <Loader label="Carregando série histórica..." />;
  if (!data?.length) return <EmptyState title="Sem dados no período" icon={<FaChartLine size={40} className="text-gray-600" />} />;

  const chartData = data.map((ponto) => {
    const row: Record<string, string | number> = { data: ponto.data, lojas: (ponto.lojas ?? []).join(", ") };
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
            const lojas = String(payload[0].payload.lojas ?? "");
            return (
              <div style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, padding: "10px 12px" }}>
                <p className="text-white font-bold mb-1">{label}</p>
                {showLojas && lojas && (
                  <p className="flex items-center gap-1.5 text-gray-400 mb-2">
                    <FaStore size={10} /> {lojas}
                  </p>
                )}
                {payload.map((p) => (
                  <p key={String(p.dataKey)} style={{ color: p.color }}>
                    {p.name}: {p.value}
                  </p>
                ))}
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
