import { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { GetInsightsVendasPeriodosTypes } from "../../../graphql/Usuario/Types";

interface EarningsChartProps {
  data: GetInsightsVendasPeriodosTypes;
}

type GastoPeriodo = NonNullable<
  GetInsightsVendasPeriodosTypes["GetInsightsGastosPeriodos"]
>[number];

interface ProcessedPoint {
  label: string;       // o que aparece no eixo X
  tratamentos: number;
  coloracoes: number;
}

type SeriesItem = { name: string; data: number[] };

/**
 * Converte "DD/MM/YYYY" → Date
 */
function parseDDMMYYYY(str: string): Date {
  const [dd, mm, yyyy] = str.split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

/**
 * Exibe "Mai/2025"
 */
function formatMonthLabel(date: Date) {
  return date.toLocaleString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Agrupa por blocos fixos de dias
 */
function groupByRange(
  raw: GastoPeriodo[],
  rangeDays: number
): ProcessedPoint[] {
  const grouped: ProcessedPoint[] = [];

  for (let i = 0; i < raw.length; i += rangeDays) {
    const slice = raw.slice(i, i + rangeDays);
    if (slice.length === 0) continue;

    const start = parseDDMMYYYY(slice[0].data);
    const end = parseDDMMYYYY(slice[slice.length - 1].data);

    const tratamentos = slice.reduce(
      (sum, d) =>
        sum +
        (d.categories.find((c) => c.title === "tratamentos")?.value ?? 0),
      0
    );

    const coloracoes = slice.reduce(
      (sum, d) =>
        sum +
        (d.categories.find((c) => c.title === "colorações")?.value ?? 0),
      0
    );

    grouped.push({
      label: `${start.toLocaleDateString("pt-BR")} → ${end.toLocaleDateString(
        "pt-BR"
      )}`,
      tratamentos,
      coloracoes,
    });
  }

  return grouped;
}

/**
 * Agrupa por mês
 */
function groupByMonth(raw: GastoPeriodo[]): ProcessedPoint[] {
  const map = new Map<
    string,
    { date: Date; tratamentos: number; coloracoes: number }
  >();

  raw.forEach((item) => {
    const dt = parseDDMMYYYY(item.data);
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;

    if (!map.has(key)) {
      map.set(key, {
        date: new Date(dt.getFullYear(), dt.getMonth(), 1),
        tratamentos: 0,
        coloracoes: 0,
      });
    }

    const entry = map.get(key)!;

    entry.tratamentos +=
      item.categories.find((c) => c.title === "tratamentos")?.value ?? 0;

    entry.coloracoes +=
      item.categories.find((c) => c.title === "colorações")?.value ?? 0;
  });

  return [...map.values()].map((v) => ({
    label: formatMonthLabel(v.date),
    tratamentos: v.tratamentos,
    coloracoes: v.coloracoes,
  }));
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  const [processed, setProcessed] = useState<ProcessedPoint[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);

  useEffect(() => {
    const raw = data?.GetInsightsGastosPeriodos;
    if (!raw || raw.length === 0) return;

    const totalDias = raw.length;
    let result: ProcessedPoint[] = [];

    // 🔥 Regras reais agora funcionando!
    if (totalDias > 90) {
      result = groupByMonth(raw);
    } else if (totalDias > 60) {
      result = groupByRange(raw, 21);
    } else {
      result = raw.map((item) => ({
        label: item.data, // já está em DD/MM/YYYY
        tratamentos:
          item.categories.find((c) => c.title === "tratamentos")?.value ?? 0,
        coloracoes:
          item.categories.find((c) => c.title === "colorações")?.value ?? 0,
      }));
    }

    setProcessed(result);

    setSeries([
      { name: "Tratamentos", data: result.map((p) => p.tratamentos) },
      { name: "Colorações", data: result.map((p) => p.coloracoes) },
    ]);
  }, [data]);

  const categories = processed.map((p) => p.label);

  const options: ApexOptions = {
    chart: {
      height: 250,
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      tickAmount: 6,
      labels: {
        rotate: -45,
        style: { colors: "#6b7280", fontSize: "12px" },
      },
    },
    stroke: { curve: "smooth", width: 3 },
    tooltip: {
      custom: ({ series, dataPointIndex }) => {
        const label = categories[dataPointIndex];
        const t = series[0][dataPointIndex];
        const c = series[1][dataPointIndex];

        return `
          <div class="p-3 text-sm">
            <strong>${label}</strong><br/>
            🧴 Tratamentos: <b>${t}</b><br/>
            🎨 Colorações: <b>${c}</b>
          </div>
        `;
      },
    },
    colors: ["#8b5cf6", "#105fb9"],
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full">
      <ApexChart
        options={options}
        series={series}
        type="area"
        height={250}
      />
    </div>
  );
};

export { EarningsChart };
