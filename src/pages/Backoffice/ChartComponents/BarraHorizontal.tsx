import React from "react";

type BarraHorizontalProps<T> = {
  dados: T[];
  dataKeyLabel: keyof T;
  dataKeyValue: keyof T;
};

export function BarraHorizontal<T extends Record<string, any>>({
  dados,
  dataKeyLabel,
  dataKeyValue,
}: BarraHorizontalProps<T>) {
  const maxValor = Math.max(...dados.map((item) => item[dataKeyValue] as number), 0);

  return (
    <div className="space-y-3">
      {dados.map((item, index) => {
        const label = item[dataKeyLabel] as string;
        const valor = item[dataKeyValue] as number;
        const percentual = (valor / maxValor) * 100;

        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-32 text-sm font-medium truncate">{label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${percentual}%` }}
              />
            </div>
            <div className="w-10 text-sm text-right font-medium">{valor}</div>
          </div>
        );
      })}
    </div>
  );
}
