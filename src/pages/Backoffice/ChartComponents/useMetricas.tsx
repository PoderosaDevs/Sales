import { GetInsightsVendasPeriodosTypes } from "@/graphql/Usuario/Types";
import { useMemo } from "react";

export type MetricasVendas = {
  mediaTotal: number;
  mediaTratamentos: number;
  mediaColoracoes: number;
};

export function useMetricasVendas(
  data?: GetInsightsVendasPeriodosTypes
): MetricasVendas {
  return useMemo(() => {
    if (!data?.GetInsightsGastosPeriodos) {
      return {
        mediaTotal: 0,
        mediaTratamentos: 0,
        mediaColoracoes: 0,
      };
    }

    const periodos = data.GetInsightsGastosPeriodos;
    const dias = periodos.length;

    let totalTratamentos = 0;
    let totalColoracoes = 0;

    for (const periodo of periodos) {
      for (const cat of periodo.categories) {
        if (cat.title === "tratamentos") {
          totalTratamentos += cat.value;
        }
        if (cat.title === "colorações") {
          totalColoracoes += cat.value;
        }
      }
    }

    return {
      mediaTotal: dias > 0 ? (totalTratamentos + totalColoracoes) / dias : 0,
      mediaTratamentos: dias > 0 ? totalTratamentos / dias : 0,
      mediaColoracoes: dias > 0 ? totalColoracoes / dias : 0,
    };
  }, [data]);
}
