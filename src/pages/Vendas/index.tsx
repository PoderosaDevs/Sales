import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FaArrowLeft, FaCoins, FaFilter, FaShoppingBag } from "react-icons/fa";
import { QueryGetProdutos } from "../../graphql/Produto/Query";
import { useShoppingCart } from "../../context/CartContext";
import { Products } from "./Products";
import { Summary } from "./Summary";
import { BarNavigation } from "./BarNavigation";
import { useAuth } from "../../context/AuthContext";
import { QueryGetMarcas } from "../../graphql/Marca/Query";
import { DateToVim } from "../../utils/dateUtils";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import MyCalendar from "../../components/calendar";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";

export function Vendas() {
  const [showFilters, setShowFilters] = useState(false);
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 25 });
  const [showBarNavigation, setShowBarNavigation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [productsView, setProductsView] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [filters, setFilters] = useState({
    nome: "",
    pontos_min: 0,
    pontos_max: 0,
    marca: "",
  });
  const { usuarioData } = useAuth();

  const { cartItems } = useShoppingCart();

  const handleAdvance = () => {
    setShowSummary(true);
    setProductsView(true);
  };

  const handleBack = () => {
    setShowSummary(false);
    setProductsView(false);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // mês vai de 0 a 11
  const currentYear = String(today.getFullYear()).slice(-2); // pega os dois últimos dígitos

  const dataMensal = `${currentMonth}/${currentYear}`;

  const { data } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
      ...(showCalendar ? {} : { dataMensal }), // só envia dataMensal se não for calendário
    },
    skip: !usuarioData,
  });

  if (!usuarioData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-[1500px] m-auto">
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-4">
          {/* Card 1: Iniciar */}
          <div className="bg-white rounded-lg flex flex-col gap-4 justify-center shadow-custom p-6 md:hidden">
            <Link
              to={"/catalog"}
              className="bg-purple-700 flex items-center justify-between text-lg font-semibold text-white rounded-lg px-4 py-4 hover:bg-purple-800"
            >
              Nova venda <IoBagHandleSharp size={20} />
            </Link>
          </div>

          {/* Card 1: Vendas */}
          <div className="bg-white rounded-lg shadow-custom p-6">
            <div className="flex items-center justify-between mb-6 border-b-2 pb-4">
              <div className="flex items-center">
                <span className="text-2xl text-gray-600 mr-2">
                  <FaCoins className="text-purple-700 text-lg max-md:text-md" />
                </span>
                <h2 className="text-lg font-semibold text-gray-800 max-md:text-sm">
                  Vendas do mês
                </h2>
              </div>
              <button
                className="text-gray-900 text-sm font-bold hover:text-custom-bg-start transition-all max-md:text-sm"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? "Lista" : "Calendário"}
              </button>
            </div>
            {showCalendar ? (
              <MyCalendar controls={true} data={data!} />
            ) : (
              <div className="flex flex-col space-y-4">
                {data?.GetVendaByUsuarioID.length === 0 ? (
                  <span className="text-gray-500 text-center text-sm">
                    Nenhuma venda registrada neste mês.
                  </span>
                ) : (
                  data?.GetVendaByUsuarioID.map((venda, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-white-200 rounded-lg shadow-custom"
                    >
                      <div className="mr-4">
                        <MdSell className="text-purple-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-dark font-semibold">
                          {DateToVim(venda.data_venda)}
                        </p>
                      </div>
                      <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                        Ver Venda
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
