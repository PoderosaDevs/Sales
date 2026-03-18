import React from "react";
import { FaPlus, FaMinus, FaAward } from "react-icons/fa";
import { Produto } from "../../context/types/CartContext";
import { useShoppingCart } from "../../context/CartContext";
import { BounceLoader } from "react-spinners";

interface ProductsProps {
  data?: any;
  loading?: boolean;
  onAddProduct: () => void;
}

export function Products({ data, loading, onAddProduct }: ProductsProps) {
  const { addProduct, removeProduct, cartItems } = useShoppingCart();

  const handleAddProduct = (produto: Produto) => {
    addProduct(produto);
    onAddProduct();
  };

  const isProductInCart = (produtoId: string) =>
    cartItems.some((item) => item.id === produtoId);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
        <BounceLoader color="#10b981" size={70} />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">Sincronizando</h2>
          <p className="text-gray-500 text-sm">Preparando o melhor catálogo para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {data?.GetProdutos.result.map((produto: any) => (
        <div
          key={produto.id}
          className="group relative bg-[#0d0d10] border border-white/5 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
        >
          {/* Imagem e Badge de Marca */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-transparent to-transparent opacity-60" />
            
            {/* Tag da Marca - Estilo Glassmorphism */}
            <div 
              className="absolute top-3 left-3 backdrop-blur-md bg-black/40 border border-white/10 text-[10px] font-bold text-white px-2.5 py-1 rounded-lg uppercase tracking-wider"
              style={{ borderLeft: `3px solid ${produto.marca.cor || '#10b981'}` }}
            >
              {produto.marca.nome || "Distribuição"}
            </div>

            {/* Pontuação do Produto */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-emerald-500 text-[#0d0d10] px-2 py-0.5 rounded-md font-black text-[10px] shadow-lg">
              <FaAward size={10} />
              {produto.pontos} PTS
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="p-4 flex-1 flex flex-col">
            <h2 className="text-white font-bold text-sm md:text-base leading-tight mb-4 line-clamp-2 h-10 group-hover:text-emerald-400 transition-colors">
              {produto.nome}
            </h2>

            <div className="mt-auto">
              {isProductInCart(produto.id) ? (
                <button
                  className="w-full flex justify-center items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                  onClick={() => removeProduct(produto.id)}
                >
                  <span>Remover</span>
                  <FaMinus size={10} />
                </button>
              ) : (
                <button
                  className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[2px] py-3 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-95 transition-all duration-300"
                  onClick={() => handleAddProduct(produto)}
                >
                  <span>Adicionar</span>
                  <FaPlus size={10} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}