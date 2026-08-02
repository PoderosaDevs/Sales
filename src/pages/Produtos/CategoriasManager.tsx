import { useState } from "react";
import { FaPlus, FaTimes, FaTags } from "react-icons/fa";
import { useCategorias, useCreateCategoria, useDeleteCategoria } from "../../hooks/useProdutos";

export function CategoriasManager({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (nome: string) => void;
}) {
  const { data: categorias } = useCategorias();
  const createCategoria = useCreateCategoria();
  const deleteCategoria = useDeleteCategoria();
  const [novaCategoria, setNovaCategoria] = useState("");

  const handleCreate = async () => {
    const nome = novaCategoria.trim();
    if (!nome) return;
    await createCategoria.mutateAsync(nome);
    setNovaCategoria("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
          placeholder="Nova categoria..."
          className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-[#0a0a0c] transition-all"
        >
          <FaPlus size={12} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {!categorias?.length && (
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <FaTags size={12} /> Nenhuma categoria cadastrada ainda.
          </p>
        )}
        {categorias?.map((cat) => {
          const isSelected = selected.includes(cat.nome);
          return (
            <span
              key={cat.id}
              className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                isSelected ? "bg-emerald-500 text-[#0a0a0c] border-emerald-500" : "bg-white/5 text-gray-400 border-white/10 hover:border-emerald-500/40"
              }`}
              onClick={() => onToggle(cat.nome)}
            >
              {cat.nome}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategoria.mutate(cat.id);
                }}
                className={`opacity-50 hover:opacity-100 ${isSelected ? "text-[#0a0a0c]" : "text-gray-500"}`}
              >
                <FaTimes size={10} />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
