import React from "react";
import { IoIosClose } from "react-icons/io";

type Props = {
  startDate: string | null;
  endDate: string | null;
  onChange: (field: "start" | "end", value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export const DateFilter = ({ startDate, endDate, onChange, onApply, onClear }: Props) => (
  <div className="flex items-center gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
      <input
        type="date"
        value={startDate ?? ""}
        onChange={(e) => onChange("start", e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Data Final</label>
      <input
        type="date"
        value={endDate ?? ""}
        onChange={(e) => onChange("end", e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>

    {startDate && endDate && (
      <button
        onClick={onApply}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Aplicar
      </button>
    )}

    {(startDate || endDate) && (
      <button
        onClick={onClear}
        className="flex items-center justify-center p-2 bg-red-500 text-white rounded hover:bg-red-600"
        title="Limpar filtros"
      >
        <IoIosClose size={16} />
      </button>
    )}
  </div>
);
