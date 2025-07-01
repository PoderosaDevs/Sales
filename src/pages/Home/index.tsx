import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { MdSell } from "react-icons/md";
import { DateToVim } from "../../utils/dateUtils";
import MyCalendar from "../../components/calendar";
import { Link } from "react-router-dom";
import { IoBagHandleSharp } from "react-icons/io5";

export function Home() {
  const { usuarioData } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);

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
          <Link
            to={"/catalog"}
            className="bg-indigo-600 flex items-center justify-between text-lg font-semibold text-white rounded-lg px-4 py-4 hover:bg-purple-800"
          >
            Iniciar venda <IoBagHandleSharp size={20} />
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
                Últimas vendas do mês
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
            data?.GetVendaByUsuarioID ? (
              <MyCalendar data={data} />
            ) : (
              <div>Carregando calendário...</div>
            )
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
                    <button
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                      onClick={() => setSelectedVenda(venda)}
                    >
                      Ver Venda
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {selectedVenda && (
          <div className="mt-4 p-4 border rounded bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Detalhes da Venda</h2>
              <button
                onClick={() => setSelectedVenda(null)}
                className="text-sm text-purple-600 hover:underline"
              >
                Fechar
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Data:</strong> {DateToVim(selectedVenda.data_venda)}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Funcionário:</strong> {selectedVenda.funcionario.nome}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {selectedVenda.venda_detalhe.map((detail: any, idx: number) => (
                <li key={idx}>
                  <strong>{detail.produto.nome}</strong> (x{detail.quantidade})
                  — {detail.pontos} pontos
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Card 2: Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <span className="text-2xl text-gray-600 mr-2">
              <BiSolidBarChartSquare className="text-purple-700 text-lg max-md:text-md" />
            </span>
            <h2 className="text-xl font-semibold text-gray-800 max-md:text-sm">
              Progressão de Metas
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-md:text-sm">
            Módulo de metas vai ser lançado em breve
          </p>
        </div>
      </div>
    </div>
  );
}
