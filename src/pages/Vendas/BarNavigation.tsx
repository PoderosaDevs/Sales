// components/BarNavigation.tsx
import React from "react";

interface BarNavigationProps {
  show: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onFinish?: () => void; // Propriedade opcional para finalizar
  showBackAndFinish?: boolean; // Propriedade opcional para mostrar ambos os botões
}

export function BarNavigation({
  show,
  onAdvance,
  onBack,
  onFinish,
  showBackAndFinish,
}: BarNavigationProps) {
  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-custom-gradient text-white p-4 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className={`max-w-[1400px] m-auto flex items-center ${
          showBackAndFinish ? "justify-between" : "justify-end"
        } px-6`}
      >
        {showBackAndFinish ? (
          <>
            <button
              onClick={onBack}
              className="bg-slate-900 px-4 py-2 text-white rounded-md font-semibold"
            >
              Voltar
            </button>
            <button
              onClick={onFinish}
              className="bg-slate-900 px-4 py-2 text-white rounded-md font-semibold"
            >
              Finalizar
            </button>
          </>
        ) : (
          <button
            onClick={onAdvance}
            className="bg-slate-900 px-4 py-2 text-white rounded-md font-semibold"
          >
            Avançar
          </button>
        )}
      </div>
    </div>
  );
}
