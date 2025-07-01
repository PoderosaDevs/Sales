import React from "react";
import { BounceLoader } from "react-spinners";

interface LoaderProps {
  size: number;
  color?: string;
  hasText: boolean;
  text?: string;
  sizeDiv?: string; // Tornando opcional e aplicando valor padrão
}

export function Loader({
  size,
  color = "#6366f1",
  hasText,
  text = "Carregando...",
  sizeDiv = "h-[25vh]", // Valor padrão se sizeDiv não for passado
}: LoaderProps) {
  return (
    <div className={`flex justify-center items-center flex-col ${sizeDiv}`}>
      {hasText && <h2 className="text-3xl text-gray-900 mb-4">{text}</h2>}
      <BounceLoader color={color} size={size} />
    </div>
  );
}
