import React, { useEffect, useState } from "react";
import { FaChartLine, FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { QueryGetVendaByID, QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { MdSell } from "react-icons/md";
import { DateToVim } from "../../utils/dateUtils";

export function Home() {
  const { usuarioData } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

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
  // Movendo a chamada do hook para fora da condicional
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
        <h1 className="text-3xl mt-4 flex items-end">
          <span className="font-bold">Olá</span>, seja bem-vindo{" "}
          <span className="font-bold ml-2">{usuarioData.nome}</span>
          <div className="w-2 h-2 bg-custom-bg-start mb-1 ml-1"></div>
        </h1>
      )}
      <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1: Vendas */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <span className="text-2xl text-gray-600 mr-2">
              <FaCoins size={24} className="text-custom-bg-start" />
            </span>
            <h2 className="text-xl font-semibold text-gray-800"> Ultimas vendas do mês</h2>
          </div>
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
                  <p className="text-lg text-dark font-semibold">{DateToVim(venda.data_venda)}</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Ver Venda
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Faturamento com gráfico */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <FaChartLine size={22} className="text-custom-bg-start" />
            <h2 className="text-xl font-semibold text-gray-800 ml-1">
              Faturamento
            </h2>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 mb-3">
            {/* Aqui pode ser adicionado um componente de gráfico */}
            <p className="text-center text-gray-700">
              Gráfico ou dados de faturamento
            </p>
          </div>
          <p className="text-gray-600">
            Descrição ou mais detalhes sobre o faturamento.
          </p>
        </div>

        {/* Card 3: Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <span className="text-2xl text-gray-600 mr-2">
              <BiSolidBarChartSquare
                size={24}
                className="text-custom-bg-start"
              />
            </span>
            <h2 className="text-xl font-semibold text-gray-800">
              Progressão de Metas
            </h2>
          </div>
          <p className="text-gray-600">Lista dos produtos mais vendidos.</p>
        </div>
      </div>
    </div>
  );
}
