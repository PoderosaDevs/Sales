import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { MdSell } from "react-icons/md";
import { DateToVim } from "../../utils/dateUtils";
import MyCalendar from "../../components/calendar";

export function Home() {
  const { usuarioData } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  // Função para verificar a largura da tela
  const checkScreenSize = () => {
    if (window.innerWidth < 555) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    // Verifica a largura da tela na montagem do componente
    checkScreenSize();

    // Adiciona um listener de resize
    window.addEventListener("resize", checkScreenSize);

    // Limpeza do listener ao desmontar o componente
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const { data } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
    },
    skip: !usuarioData, // Para evitar a execução quando usuarioData for null
  });

  if (!usuarioData) return <div>Loading...</div>;

  return (
    <div className="max-w-[1500px] px-6 m-auto">
      {isVisible && (
        <h1 className="text-3xl mt-4 flex items-end none md:flex">
          <span className="font-bold">Olá</span>, seja bem-vindo{" "}
          <span className="font-bold ml-2">{usuarioData.nome}</span>
          <div className="w-2 h-2 bg-custom-bg-start mb-1 ml-1"></div>
        </h1>
      )}
      <div className="grid mt-12 grid-cols-1 md:grid-cols-2 gap-4 md:mt-4">
        {/* Card 1: Iniciar */}
        <div className="bg-white rounded-lg flex flex-col gap-4 justify-center shadow-custom p-6 md:hidden">
          <button className="bg-purple-700 text-lg font-semibold text-white rounded-lg px-8 py-4 hover:bg-purple-800">
            Iniciar venda
          </button>
        </div>

        {/* Card 1: Vendas */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center justify-between mb-6 border-b-2 pb-4">
            <div className="flex items-center">
              <span className="text-2xl text-gray-600 mr-2">
                <FaCoins size={24} className="text-purple-700" />
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                Últimas vendas do mês
              </h2>
            </div>
            <button
              className="text-gray-900 text-sm font-bold hover:text-custom-bg-start transition-all"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? "Ver como Lista" : "Ver no Calendário"}
            </button>
          </div>
          {showCalendar ? (
            <MyCalendar />
          ) : (
            <div className="flex flex-col space-y-4">
              {data?.GetVendaByUsuarioID.map((venda, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-green-200 rounded-lg shadow-md"
                >
                  <div className="mr-4">
                    <MdSell className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-dark font-semibold">
                      {DateToVim(venda.data_venda)}
                    </p>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Ver Venda
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <span className="text-2xl text-gray-600 mr-2">
              <BiSolidBarChartSquare
                size={24}
                className="text-purple-700"
              />
            </span>
            <h2 className="text-xl font-semibold text-gray-800">
              Progressão de Metas
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Módulo de metas vai ser lançado em breve
          </p>
        </div>
      </div>
    </div>
  );
}
