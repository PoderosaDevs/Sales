import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Produto } from "../../context/types/CartContext";
import { useShoppingCart } from "../../context/CartContext";
import { BounceLoader } from "react-spinners";

interface ProductsProps {
  data?: any;
  loading?: boolean; // Tipo booleano para o loading
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

  // Tratativa para exibir o spinner enquanto estiver carregando
  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col h-[50vh]">
        <h2 className="text-3xl text-gray-900 mb-4">Carregando</h2>
        <BounceLoader color="#d40f7d" size={84} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {data?.GetProdutos.result.map((produto: any) => (
        <div
          key={produto.id}
          className="bg-white shadow-custom rounded-lg overflow-hidden flex flex-col"
        >
          <div className="relative">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-auto object-cover"
            />
            <div
              className={`absolute top-2 left-2 text-white text-xs font-medium px-2 py-1 rounded`}
              style={{ backgroundColor: produto.marca.cor }}
            >
              {produto.marca.nome || "Produto"}
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-end">
            <h2 className="text-sm font-semibold mb-2 md:text-lg">{produto.nome}</h2>
            <div className="flex items-center justify-between">
              {isProductInCart(produto.id) ? (
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-gray-600  md:text-lg">
                    Produto já adicionado
                  </span>
                  <button
                    className="bg-red-700 text-sm text-white px-3 py-2 rounded hover:bg-red-500 transition"
                    onClick={() => removeProduct(produto.id)}
                  >
                    <FaMinus size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm gap-2 md:text-xl">
                    {produto.pontos || "N/A"}
                    <span className="ml-2">Pontos</span>
                  </span>
                  <button
                    className="bg-purple-700 text-sm px-1 py-1  text-white rounded hover:bg-purple-800 transition md:px-3 md:py-2 "
                    onClick={() => handleAddProduct(produto)}
                  >
                    <FaPlus size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
