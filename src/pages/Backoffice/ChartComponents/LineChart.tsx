import React, { useEffect, useState } from "react";
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
  label: string;
  tratamentos: number;
  coloracoes: number;
}

type SeriesItem = { name: string; data: number[] };

function parseDDMMYYYY(str: string): Date {
  const [dd, mm, yyyy] = str.split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

function formatMonthLabel(date: Date) {
  return date.toLocaleString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

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
        (d.categories.find((c) => c.title.toLowerCase() === "tratamentos")?.value ?? 0),
      0
    );

    const coloracoes = slice.reduce(
      (sum, d) =>
        sum +
        (d.categories.find((c) => c.title.toLowerCase() === "colorações")?.value ?? 0),
      0
    );

    grouped.push({
      label: `${start.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} → ${end.toLocaleDateString(
        "pt-BR", { day: '2-digit', month: '2-digit' }
      )}`,
      tratamentos,
      coloracoes,
    });
  }

  return grouped;
}

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
      item.categories.find((c) => c.title.toLowerCase() === "tratamentos")?.value ?? 0;

    entry.coloracoes +=
      item.categories.find((c) => c.title.toLowerCase() === "colorações")?.value ?? 0;
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
    if (!raw || raw.length === 0) {
        setProcessed([]);
        setSeries([]);
        return;
    }

    const totalDias = raw.length;
    let result: ProcessedPoint[] = [];

    if (totalDias > 90) {
      result = groupByMonth(raw);
    } else if (totalDias > 60) {
      result = groupByRange(raw, 21);
    } else {
      result = raw.map((item) => ({
        label: item.data,
        tratamentos:
          item.categories.find((c) => c.title.toLowerCase() === "tratamentos")?.value ?? 0,
        coloracoes:
          item.categories.find((c) => c.title.toLowerCase() === "colorações")?.value ?? 0,
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
      type: "area",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    theme: { mode: "dark" },
    xaxis: {
      categories,
      tickAmount: 6,
      labels: {
        rotate: -45,
        style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
      strokeDashArray: 4,
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const label = w.globals.categoryLabels[dataPointIndex];
        const t = series[0][dataPointIndex];
        const c = series[1][dataPointIndex];

        return `
          <div style="background: #0d0d10; border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">${label}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="font-size: 13px; color: #fff;">🧴 Tratamentos: <b style="color: #8b5cf6;">${t}</b></div>
                <div style="font-size: 13px; color: #fff;">🎨 Colorações: <b style="color: #10b981;">${c}</b></div>
            </div>
          </div>
        `;
      },
    },
    colors: ["#8b5cf6", "#10b981"],
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#94a3b8" },
    },
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ApexChart
        options={options}
        series={series}
        type="area"
        height="100%"
      />
    </div>
  );
};

export { EarningsChart };