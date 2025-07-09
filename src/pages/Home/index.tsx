import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { MdSell } from "react-icons/md";
import { IoBagHandleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { QueryGetMetas } from "../../graphql/Meta/Query";
import { useAuth } from "../../context/AuthContext";

import { DateToVim } from "../../utils/dateUtils";
import MyCalendar from "../../components/calendar";
import { MetaCard } from "../Metas/partials/MetaCard";

/**
 * Página inicial do vendedor.
 * Mostra:
 *  - Boas‑vindas
 *  - Vendas do mês (lista ou calendário)
 *  - Cards de metas com barra de progresso e checkpoints
 */
export function Home() {
  const { usuarioData } = useAuth();

  /**
   * UI state
   */
  const [isVisible, setIsVisible] = useState(true); // título "Olá…"
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);

  // --- Responsividade -------------------------------------------------------
  const checkScreenSize = () => {
    setIsVisible(window.innerWidth >= 555);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // --- Datas ----------------------------------------------------------------
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentYear = String(today.getFullYear()).slice(-2);
  const dataMensal = `${currentMonth}/${currentYear}`; // ex.: 07/25

  // --- Queries --------------------------------------------------------------
  const { data: vendasData, loading: vendasLoading } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
      ...(showCalendar ? {} : { dataMensal }),
    },
    skip: !usuarioData,
  });

  const {
    data: metasData,
    loading: metasLoading,
    error: metasError,
  } = QueryGetMetas({
    variables: { usuarioId: usuarioData ? parseInt(usuarioData.id) : 0 },
    skip: !usuarioData,
  });

  // --- Handler para detalhes da meta ---------------------------------------
  const [metaEmFocoId, setMetaEmFocoId] = useState<number | null>(null);
  const toggleDetalhesMeta = (id: number) => {
    setMetaEmFocoId((prev) => (prev === id ? null : id));
  };

  if (!usuarioData) return <div>Loading...</div>;

  // -------------------------------------------------------------------------
  return (
    <div className="max-w-[1500px] px-6 pt-4 m-auto">
      {/* Saudações --------------------------------------------------------- */}
      {isVisible && (
        <h1 className="text-3xl mt-4 pb-4 flex items-end">
          <span className="font-bold">Olá</span>, seja‑bem‑vindo
          <span className="font-bold ml-2">{usuarioData.nome}</span>
          <div className="w-2 h-2 bg-custom-bg-start mb-1 ml-1" />
        </h1>
      )}

      <div className="grid mt-12 grid-cols-1 md:grid-cols-2 gap-4 md:mt-4">
        {/* ----------------------------------------------------------------- */}
        {/* Card "Iniciar venda" (apenas mobile)                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-white rounded-lg flex flex-col gap-4 justify-center shadow-custom p-6 md:hidden">
          <Link
            to="/catalog"
            className="bg-indigo-600 flex items-center justify-between text-lg font-semibold text-white rounded-lg px-4 py-4 hover:bg-purple-800"
          >
            Iniciar venda <IoBagHandleSharp size={20} />
          </Link>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Card de Vendas                                                   */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-6 border-b-2 pb-4">
            <div className="flex items-center">
              <FaCoins className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Últimas vendas do mês
              </h2>
            </div>
            <button
              className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? "Lista" : "Calendário"}
            </button>
          </div>

          {/* Conteúdo */}
          {showCalendar ? (
            vendasLoading ? (
              <div>Carregando calendário…</div>
            ) : (
              vendasData?.GetVendaByUsuarioID && (
                <MyCalendar data={vendasData} />
              )
            )
          ) : (
            <div className="flex flex-col space-y-4">
              {vendasLoading ? (
                <span className="text-center">Carregando…</span>
              ) : vendasData?.GetVendaByUsuarioID?.length ? (
                vendasData.GetVendaByUsuarioID.map((venda: any) => (
                  <div
                    key={venda.id}
                    className="flex items-center p-4 bg-white-200 rounded-lg shadow-custom"
                  >
                    <MdSell className="text-indigo-600 mr-4" size={24} />
                    <p className="flex-1 font-semibold text-dark">
                      {DateToVim(venda.data_venda)}
                    </p>
                    <button
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                      onClick={() => setSelectedVenda(venda)}
                    >
                      Ver Venda
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-center text-md mt-6">
                  Nenhuma venda registrada neste mês.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Detalhes da venda ---------------------------------------------- */}
        {selectedVenda && (
          <div className="mt-4 p-4 border rounded bg-white shadow md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Detalhes da Venda</h2>
              <button
                onClick={() => setSelectedVenda(null)}
                className="text-sm text-indigo-600 hover:underline"
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
              {selectedVenda.venda_detalhe.map((d: any) => (
                <li key={d.id}>
                  <strong>{d.produto.nome}</strong> (x{d.quantidade}) — {d.pontos} pontos
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Card de Metas (progressão)                                      */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-white rounded-lg shadow-custom p-6 md:col-span-1">
          {/* Cabeçalho */}
          <div className="flex items-center mb-6 border-b-2 pb-4">
            <BiSolidBarChartSquare className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Progressão de Metas
            </h2>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {metasLoading ? (
              <div className="col-span-full text-center py-8">Carregando metas…</div>
            ) : metasError ? (
              <div className="col-span-full text-center text-red-500 py-8">
                Erro ao carregar metas: {metasError.message}
              </div>
            ) : metasData?.GetMetas?.length ? (
              metasData.GetMetas.map((meta: any) => (
                <MetaCard
                  key={meta.id}
                  meta={meta}
                  onDetalhes={toggleDetalhesMeta}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                Nenhuma meta cadastrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
