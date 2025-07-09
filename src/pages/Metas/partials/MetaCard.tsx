// components/MetaCard.tsx
import React from "react";
import { ProgressBarEtapas } from "./progressBar";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface Etapa {
  id: string | number;
  nome: string;
  quantidade_atual: number;
  quantidade_objetivo: number;
  atingida: boolean;
}

interface Meta {
  id: string | number;
  nome: string;
  quantidade_atual: number;
  quantidade_objetivo: number;
  meta_etapas: Etapa[];
}

interface Props {
  meta: Meta;
  onDetalhes?: (id: number) => void;   // ⬅ aqui mudou
}

export const MetaCard: React.FC<Props> = ({ meta, onDetalhes }) => {
  const percent =
    (meta.quantidade_atual / meta.quantidade_objetivo) * 100 || 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4">
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-800">{meta.nome}</h3>

      {/* Barra de progresso */}
      <ProgressBarEtapas metaObjetivo={meta.quantidade_objetivo} etapas={meta.meta_etapas} percentGlobal={percent} />

      {/* Mini-legenda opcional */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>Atual: {meta.quantidade_atual}</span>
        <span>Meta: {meta.quantidade_objetivo}</span>
      </div>
    </div>
  );
};
