import React, { useState } from "react";
import { FaArrowLeft, FaFilter, FaShoppingBag } from "react-icons/fa";
import Swal from "sweetalert2";
import { QueryGetProdutos } from "../../graphql/Produto/Query";
import { useShoppingCart } from "../../context/CartContext";
import { Products } from "./Products";
import { Summary } from "./Summary";
import { QueryGetMarcas } from "../../graphql/Marca/Query";

export function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 25 });
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState({
    nome: "",
    pontos_min: 0,
    pontos_max: 0,
    marca: "",
  });

  const { cartItems } = useShoppingCart();

  const { data, loading } = QueryGetProdutos({
    variables: {
      pagination: { pagina: paginacao.pagina, quantidade: paginacao.quantidade },
      ...filters,
    },
  });

  const { data: DataMarca } = QueryGetMarcas();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filtersOpen = showFilters && !showSummary;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {showSummary ? "Resumo da Venda" : "Catálogo de Produtos"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {showSummary ? (
            <button
              onClick={() => {
                // Garante que nenhum modal do SweetAlert2 esteja
                // no meio de uma animação de fechamento quando o
                // React troca de Summary pro Catálogo — evita a
                // corrida que causa o erro "insertBefore" no Android.
                Swal.close();
                setShowSummary(false);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-300 font-bold text-[10px] uppercase tracking-[2px] transition-all"
            >
              <FaArrowLeft className="text-emerald-500" />
              Voltar ao Catálogo
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] transition-all border ${
                  showFilters 
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <FaFilter size={12} />
                Filtros
              </button>

              {cartItems.length > 0 && (
                <button
                  onClick={() => setShowSummary(true)}
                  className="relative flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[2px] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                >
                  <FaShoppingBag size={14} />
                  Ver Carrinho
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-emerald-600 rounded-full flex items-center justify-center text-[11px] font-black shadow-xl border-2 border-emerald-600">
                    {cartItems.length}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ÁREA DE FILTROS (GLASS CARD) — transição feita só com Tailwind, sem lib externa mexendo no DOM. */}
      {/* O elemento fica sempre montado; só a altura/opacidade animam via classes condicionais. */}
      <div
        aria-hidden={!filtersOpen}
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          filtersOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="bg-[#0d0d10] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">
                  Buscar por Nome
                </label>
                <input
                  name="nome"
                  type="text"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  placeholder="Ex: Arroz, Feijão..."
                  value={filters.nome}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Pontos */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">
                  Faixa de Pontuação
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name="pontos_min"
                    type="number"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-center focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="Min"
                    value={filters.pontos_min}
                    onChange={handleFilterChange}
                  />
                  <div className="w-4 h-px bg-white/10" />
                  <input
                    name="pontos_max"
                    type="number"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-center focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="Max"
                    value={filters.pontos_max}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Marca */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">
                  Marca / Fabricante
                </label>
                <select
                  name="marca"
                  className="w-full px-4 py-3 bg-[#0a0a0c] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/40 outline-none appearance-none cursor-pointer"
                  value={filters.marca}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as Marcas</option>
                  {DataMarca?.GetMarcas?.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      {/* A key força o React a desmontar/remontar por completo ao trocar
          entre Catálogo e Resumo, em vez de tentar remendar a árvore —
          isso protege contra qualquer nó de DOM que libs externas
          (SweetAlert2) possam ter deixado para trás. */}
      <div className="min-h-[400px]" key={showSummary ? "summary" : "products"}>
        {showSummary ? (
          <div className="animate-in slide-in-from-right-8 duration-500">
            <Summary />
          </div>
        ) : (
          <div className="animate-in slide-in-from-left-8 duration-500">
            <Products
              data={data}
              loading={loading}
              onAddProduct={() => {}} // Lógica interna do seu BarNavigation
            />
          </div>
        )}
      </div>
    </div>
  );
}
