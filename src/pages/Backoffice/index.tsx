import React, { useState, useRef, useEffect } from "react";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { RankingFuncionarios } from "./TableComponents/RankingFuncionarios";
import { RankingLojas } from "./TableComponents/RankingLojas";
import { RankingMarcas } from "./TableComponents/RankingMarcas";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { FaXmark } from "react-icons/fa6";

export function Backoffice() {
  const { usuarioData } = useAuth();

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Controle do popup
  const popupRef = useRef<HTMLDivElement>(null); // Referência para o popup

  const { data } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
    },
    skip: !usuarioData,
  });

  if (!usuarioData) return <div>Loading...</div>;

  function formatDateToDDMMYYYY(date: Date | undefined) {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  }

  const isRangeComplete = range?.from && range?.to;
  const startDateFormatted = formatDateToDDMMYYYY(range?.from);
  const endDateFormatted = formatDateToDDMMYYYY(range?.to);

  // Função para fechar o popup se o clique for fora do popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-[1500px] px-6 mt-8 m-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl mt-4 flex items-end hidden md:block">
          <span className="font-bold">Olá</span>, seja bem-vindo
          <span className="font-bold ml-2">{usuarioData.nome}</span>
        </h1>

        <div className="mt-4 mb-8 flex items-center gap-4">
          <label className="flex text-gray-700 mb-1">Filtrar:</label>

          {/* Exibe o botão ou as datas selecionadas */}
          <div>
            {startDateFormatted && endDateFormatted ? (
              <div className="flex gap-3">
                <span
                  className="cursor-pointer text-purple-700 font-bold bg-white shadow-md px-4 py-2 rounded-lg"
                  onClick={() => setIsPopupVisible(!isPopupVisible)} // Alterna a visibilidade do popup ao clicar nas datas
                >
                  {startDateFormatted} - {endDateFormatted}
                </span>
                <button
                  className="bg-white shadow-md rounded-lg flex items-center justify-center p-2"
                  onClick={() => setRange(undefined)}
                >
                  <FaXmark />
                </button>
              </div>
            ) : (
              // Caso contrário, exibe o botão
              <button
                className="bg-purple-700 text-white py-2 px-4 rounded"
                onClick={() => setIsPopupVisible(!isPopupVisible)} // Alterna a visibilidade do popup ao clicar no botão
              >
                Selecionar Data
              </button>
            )}
          </div>

          {/* Popup com o DayPicker */}
          {isPopupVisible && (
            <div
              ref={popupRef}
              className="absolute bg-white p-4 rounded-lg shadow-md mt-10 z-10"
            >
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={ptBR}
                className="bg-white p-2 rounded"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid mt-6 mb-6 grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Vendas por Marcas</h2>
          <RankingMarcas
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Vendas por Lojas</h2>
          <RankingLojas
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-bold mb-4">Ranking de Vendedores</h2>
          <RankingFuncionarios
            startDate={isRangeComplete ? startDateFormatted : ""}
            endDate={isRangeComplete ? endDateFormatted : ""}
          />
        </div>
      </div>
    </div>
  );
}
