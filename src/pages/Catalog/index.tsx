import { useState } from "react";
import { FaFilter, FaShoppingBag } from "react-icons/fa";
import { useProdutos } from "../../hooks/useProdutos";
import { useMarcas } from "../../hooks/useMarcas";
import { Products } from "./Products";
import { CartModal } from "./CartModal";
import { CartItem, Produto } from "../../types";
import { Pagination } from "../../components/Pagination";

export function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [filters, setFilters] = useState({ nome: "", pontos_min: "", pontos_max: "", marca: "" });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { data, isLoading } = useProdutos({
    nome: filters.nome || undefined,
    marca: filters.marca || undefined,
    pontos_min: filters.pontos_min ? Number(filters.pontos_min) : undefined,
    pontos_max: filters.pontos_max ? Number(filters.pontos_max) : undefined,
    pagina,
    quantidade: 24,
  });
  const { data: marcas } = useMarcas();

  const addProduct = (produto: Produto) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === produto.id);
      if (existing) {
        return prev.map((item) => (item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item));
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeProduct = (produtoId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== produtoId));
  };

  const updateItemQuantity = (id: number, newQuantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantidade: Math.max(newQuantity, 1) } : item)));
  };

  const clearCart = () => setCartItems([]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagina(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Catálogo de Produtos</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] transition-all border ${
              showFilters ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <FaFilter size={12} />
            Filtros
          </button>

          <button
            onClick={() => cartItems.length > 0 && setIsCartOpen(true)}
            disabled={cartItems.length === 0}
            className={`relative flex items-center gap-2 px-5 md:px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] shadow-lg transition-all ${
              cartItems.length > 0
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-95 cursor-pointer"
                : "bg-white/5 text-gray-600 shadow-none cursor-not-allowed"
            }`}
          >
            <FaShoppingBag size={14} />
            Ver Carrinho
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-emerald-600 rounded-full flex items-center justify-center text-[11px] font-black shadow-xl border-2 border-emerald-600">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        aria-hidden={!showFilters}
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="bg-[#0d0d10] border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Buscar por Nome</label>
                <input
                  name="nome"
                  type="text"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  placeholder="Ex: Shampoo, Tintura..."
                  value={filters.nome}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Faixa de Pontuação</label>
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] ml-1">Marca / Fabricante</label>
                <select
                  name="marca"
                  className="w-full px-4 py-3 bg-[#0a0a0c] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/40 outline-none appearance-none cursor-pointer"
                  value={filters.marca}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as Marcas</option>
                  {marcas?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        <Products produtos={data?.result} isLoading={isLoading} cartItems={cartItems} onAddProduct={addProduct} onRemoveProduct={removeProduct} />
      </div>

      {data?.pageInfo && <Pagination pageInfo={data.pageInfo} onChange={setPagina} />}

      <CartModal
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        updateItemQuantity={updateItemQuantity}
        removeProduct={removeProduct}
        clearCart={clearCart}
      />
    </div>
  );
}
