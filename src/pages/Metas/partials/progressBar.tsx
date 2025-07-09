import React from "react";

/**
 * Tipo para uma etapa da meta
 */
export interface Etapa {
  id: string | number;
  nome: string;
  quantidade_atual: number;
  quantidade_objetivo: number;
  atingida: boolean;
}

interface Props {
  etapas: Etapa[];
  /** Valor total da meta (meta.quantidade_objetivo) */
  metaObjetivo: number;
  /** Porcentagem global já concluída (0‑100) */
  percentGlobal: number;
}

/**
 * Barra de progresso que exibe checkpoints das etapas em posições proporcionais
 * ao valor `quantidade_objetivo` de cada etapa.
 *
 * Regras:
 *  • Cada checkpoint é colocado em `left = etapa.quantidade_objetivo / metaObjetivo * 100%`.
 *  • Todas as etapas são exibidas, mesmo que exista uma etapa cujo objetivo seja
 *    igual ao total da meta (ponto final da barra).
 *  • Caso haja colisão (duas etapas exatamente na mesma %), apenas o primeiro
 *    será renderizado para evitar sobreposição visual.
 *  • Marcadores ficam **centralizados verticalmente** na barra.
 */
export const ProgressBarEtapas: React.FC<Props> = ({
  etapas,
  metaObjetivo,
  percentGlobal,
}) => {
  // Evita divisão por zero
  const safeMetaObjetivo = metaObjetivo === 0 ? 1 : metaObjetivo;

  // Calcula a posição percentual de cada etapa
  const etapasComPercent = etapas.map((e) => ({
    ...e,
    percent: Math.min(100, (e.quantidade_objetivo / safeMetaObjetivo) * 100),
  }));

  // Elimina checkpoints duplicados na mesma posição para não empilhar círculos
  const uniquePercents = new Set<number>();
  const etapasFiltradas = etapasComPercent.filter((e) => {
    if (uniquePercents.has(e.percent)) return false;
    uniquePercents.add(e.percent);
    return true;
  });

  return (
    <div className="relative w-full h-3 bg-gray-200 rounded-full">
      {/* Barra preenchida global */}
      <div
        className="absolute left-0 top-0 h-3 bg-indigo-500 rounded-full transition-all duration-500"
        style={{ width: `${percentGlobal}%` }}
      />

      {etapasFiltradas.map((etapa) => (
        <div
          key={etapa.id}
          style={{ left: `${etapa.percent}%` }}
          // Centraliza verticalmente (top-1/2) e horizontalmente (-translate-x-1/2)
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            title={`${etapa.nome}: ${etapa.quantidade_atual}/${etapa.quantidade_objetivo}`}
            className={`w-6 h-6 rounded-full border-2 shadow-sm ${
              etapa.atingida
                ? "bg-green-500 border-green-600"
                : "bg-gray-200"
            }`}
          />
        </div>
      ))}
    </div>
  );
};