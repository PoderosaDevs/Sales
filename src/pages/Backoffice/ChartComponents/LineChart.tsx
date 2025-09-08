import { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { GetInsightsVendasPeriodosTypes } from "../../../graphql/Usuario/Types";


interface EarningsChartProps {
  data: GetInsightsVendasPeriodosTypes;
}

const EarningsChart: React.FC<EarningsChartProps> = ({
  data
}) => {
 

  const [charData, setCharData] = useState<{ name: string; data: number[] }[]>(
    []
  );
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (data?.GetInsightsGastosPeriodos) {
      const raw = data.GetInsightsGastosPeriodos;

      const datas = raw.map((item) => item.data);

      const tratamentos = raw.map(
        (item) =>
          item.categories.find((c) => c.title === "tratamentos")?.value ?? 0
      );

      const coloracoes = raw.map(
        (item) =>
          item.categories.find((c) => c.title === "colorações")?.value ?? 0
      );

      setCategories(datas);
      setCharData([
        { name: "Tratamentos", data: tratamentos },
        { name: "Colorações", data: coloracoes },
      ]);
    }
  }, [data]);

  const options: ApexOptions = {
    series: charData,
    chart: {
      height: 250,
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      labels: {
        colors: "#374151",
      },
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
      crosshairs: {
        position: "front",
        stroke: {
          color: "#1e3a8a",
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
        formatter: (val: number) => `${Math.floor(val)} unid`,
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, dataPointIndex }) => {
        const dia = categories[dataPointIndex] ?? "";
        const tratamentos = series[0][dataPointIndex] ?? 0;
        const coloracoes = series[1][dataPointIndex] ?? 0;

        return `
          <div class="flex flex-col gap-2 p-3.5">
            <div class="font-medium text-sm text-gray-600">Quantidade em ${dia}</div>
            <div class="flex flex-col gap-1.5 text-sm text-gray-800">
              <div>🧴 Tratamentos: <strong>${tratamentos} unid</strong></div>
              <div>🎨 Colorações: <strong>${coloracoes} unid</strong></div>
            </div>
          </div>
        `;
      },
    },
    markers: {
      size: 0,
      strokeColors: ["#8b5cf6", "#105fb9"],
      strokeWidth: 4,
      hover: { size: 8 },
    },
    colors: ["#8b5cf6", "#105fb9"],
    fill: {
      gradient: {
        opacityFrom: 0.25,
        opacityTo: 0,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
  };


  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Quantidade por período
        </h3>
      </div>
      <div className="px-2 pb-1">
        {charData.length > 0 && (
          <ApexChart
            id="earnings_chart"
            options={options}
            series={options.series}
            type="area"
            height={250}
          />
        )}
      </div>
    </div>
  );
};

export { EarningsChart };
