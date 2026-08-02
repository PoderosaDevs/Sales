import { FaPlus, FaMinus, FaAward } from "react-icons/fa";
import { CartItem, Produto } from "../../types";
import { Loader, EmptyState } from "../../components/Loader";

interface ProductsProps {
  produtos?: Produto[];
  isLoading?: boolean;
  cartItems: CartItem[];
  onAddProduct: (produto: Produto) => void;
  onRemoveProduct: (produtoId: number) => void;
}

export function Products({ produtos, isLoading, cartItems, onAddProduct, onRemoveProduct }: ProductsProps) {
  const isProductInCart = (produtoId: number) => cartItems.some((item) => item.id === produtoId);

  if (isLoading) {
    return <Loader label="Sincronizando catálogo..." />;
  }

  if (!produtos?.length) {
    return <EmptyState title="Nenhum produto encontrado" icon={<FaAward size={40} className="text-gray-600" />} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {produtos.map((produto) => (
        <div
          key={produto.id}
          className="group relative bg-[#0d0d10] border border-white/5 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
        >
          <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700">
                <FaAward size={32} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-transparent to-transparent opacity-60" />

            {produto.marca && (
              <div
                className="absolute top-3 left-3 backdrop-blur-md bg-black/40 border border-white/10 text-[10px] font-bold text-white px-2.5 py-1 rounded-lg uppercase tracking-wider max-w-[calc(100%-24px)] truncate"
                style={{ borderLeft: `3px solid ${produto.marca.cor || "#10b981"}` }}
              >
                {produto.marca.nome}
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-emerald-500 text-[#0d0d10] px-2 py-0.5 rounded-md font-black text-[10px] shadow-lg">
              <FaAward size={10} />
              {produto.pontos ?? 0} PTS
            </div>
          </div>

          <div className="p-3 md:p-4 flex-1 flex flex-col">
            <h2 className="text-white font-bold text-sm md:text-base leading-tight mb-4 line-clamp-2 h-10 group-hover:text-emerald-400 transition-colors">
              {produto.nome}
            </h2>

            <div className="mt-auto">
              {isProductInCart(produto.id) ? (
                <button
                  className="w-full flex justify-center items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                  onClick={() => onRemoveProduct(produto.id)}
                >
                  <span>Remover</span>
                  <FaMinus size={10} />
                </button>
              ) : (
                <button
                  className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[2px] py-3 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-95 transition-all duration-300"
                  onClick={() => onAddProduct(produto)}
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
