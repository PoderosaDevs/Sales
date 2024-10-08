// pages/Catalog.tsx
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FaArrowLeft, FaFilter, FaShoppingBag } from "react-icons/fa";
import { QueryGetProdutos } from "../../graphql/Produto/Query";
import { useShoppingCart } from "../../context/CartContext";
import { Products } from "./Products";
import { Summary } from "./Summary";
import { BarNavigation } from "./BarNavigation";
import { useAuth } from "../../context/AuthContext";

export function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });
  const [showBarNavigation, setShowBarNavigation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [productsView, setProductsView] = useState(false);
  const { cartItems } = useShoppingCart();
  const { data, loading, error } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  const handleAdvance = () => {
    setShowSummary(true);
    setProductsView(true);
  };

  const handleBack = () => {
    setShowSummary(false);
    setProductsView(false);
  };

  return (
    <div className="p-6 max-w-[1500px] m-auto">
      {showSummary ? (
        <>
          <div className="mb-6 w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold">Resumo da venda</h1>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="relative bg-slate-800 rounded-md text-white flex px-5 py-2 items-center gap-2"
              >
                <FaArrowLeft />
                Voltar
              </button>
            </div>
          </div>
          <Summary />
        </>
      ) : (
        <>
          <div className="mb-6 w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold">Catálogo</h1>

            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-700 px-4 py-2 text-white rounded-md font-semibold flex items-center gap-2"
              >
                <FaFilter />
                Filtros
              </button>

              {cartItems.length > 0 && (
                <button
                  disabled={cartItems.length === 0}
                  onClick={handleAdvance}
                  className="relative bg-slate-700 rounded-md text-white flex px-5 py-2 items-center gap-2"
                >
                  <FaShoppingBag />
                  Produtos
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Filter Card */}
          <CSSTransition
            in={showFilters}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div className="bg-white shadow-custom rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Filtros</h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-6">
                  {/* Filter by Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="border border-gray-300 rounded-lg w-full p-2"
                      placeholder="Digite o nome do produto"
                    />
                  </div>

                  {/* Filter by Price */}
                  <div className="mb-4">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Preço
                    </label>
                    <div className="relative flex justify-between items-center gap-2">
                      <input
                        type="text"
                        placeholder="Preço Min."
                        className="border border-gray-300 rounded-lg w-full p-2"
                      />
                      <input
                        type="text"
                        placeholder="Preço Max"
                        className="border border-gray-300 rounded-lg w-full p-2"
                      />
                    </div>
                  </div>

                  {/* Filter by Brand */}
                  <div className="mb-4">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Marca
                    </label>
                    <select
                      id="brand"
                      className="border border-gray-300 rounded-lg w-full p-2"
                    >
                      <option value="">Filtrar por marca</option>
                      <option value="brand1">Brand 1</option>
                      <option value="brand2">Brand 2</option>
                      <option value="brand3">Brand 3</option>
                    </select>
                  </div>

                  {/* Filter by Type */}
                  <div className="mb-4">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tipo
                    </label>
                    <select
                      id="type"
                      className="border border-gray-300 rounded-lg w-full p-2"
                    >
                      <option value="">Filtrar por tipo</option>
                      <option value="single">Single</option>
                      <option value="kit">Kit</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </CSSTransition>
          <Products
            data={data}
            loading={loading}
            onAddProduct={() => setShowBarNavigation(true)}
          />
        </>
      )}
    </div>
  );
}
