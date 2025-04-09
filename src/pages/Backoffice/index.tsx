import React, { useState } from "react";
import { QueryGetVendasByUsuarioID } from "../../graphql/Venda/Query";
import { useAuth } from "../../context/AuthContext";
import { RankingFuncionarios } from "./TableComponents/RankingFuncionarios";
import { RankingLojas } from "./TableComponents/RankingLojas";
import { RankingMarcas } from "./TableComponents/RankingMarcas";

export function Backoffice() {
  const { usuarioData } = useAuth();
  const [filtroData, setFiltroData] = useState("");
  const [ordemDescMarca, setOrdemDescMarca] = useState(true);
  const [ordemDescLoja, setOrdemDescLoja] = useState(true);
  const [ordemDescRanking, setOrdemDescRanking] = useState(true);

  const { data } = QueryGetVendasByUsuarioID({
    variables: {
      getVendaByUsuarioIdId: usuarioData ? parseInt(usuarioData.id) : 0,
    },
    skip: !usuarioData,
  });

  if (!usuarioData) return <div>Loading...</div>;

  const vendasPorMarca = [
    { marca: "Nike", vendas: 120, data: "2024-03-25" },
    { marca: "Adidas", vendas: 88, data: "2024-03-24" },
    { marca: "Mahalo", vendas: 58, data: "2024-03-24" },
    { marca: "Lacoste", vendas: 68, data: "2024-03-24" },
    { marca: "Puma", vendas: 75, data: "2024-03-23" },
    { marca: "Reebok", vendas: 90, data: "2024-03-22" },
    { marca: "New Balance", vendas: 65, data: "2024-03-20" },
  ];

  const vendasPorLoja = [
    { loja: "Loja A", vendas: 200, data: "2024-03-25" },
    { loja: "Loja B", vendas: 150, data: "2024-03-24" },
    { loja: "Loja C", vendas: 180, data: "2024-03-23" },
    { loja: "Loja D", vendas: 130, data: "2024-03-22" },
  ];

  const ranking = [
    { usuario: "Carlos", pontos: 500 },
    { usuario: "Ana", pontos: 450 },
    { usuario: "João", pontos: 400 },
  ];

  const filtrarEOrdenar = (dados, ordemDesc) => {
    let filtrados = filtroData
      ? dados.filter((item) => item.data === filtroData)
      : dados;
    return filtrados.sort((a, b) => (ordemDesc ? b.vendas - a.vendas : a.vendas - b.vendas));
  };

  return (
    <div className="max-w-[1500px] px-6 mt-8 m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mt-4 flex items-end">
          <span className="font-bold">Olá</span>, seja bem-vindo
          <span className="font-bold ml-2">{usuarioData.nome}</span>
        </h1>
        <div className="mt-4">
          <label className="block text-gray-700">Filtrar por Data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="grid mt-6 grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex justify-between">
            Vendas por Marca
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setOrdemDescMarca(!ordemDescMarca)}
            >
              Ordenar {ordemDescMarca ? "Crescente" : "Decrescente"}
            </button>
          </h2>
          <RankingMarcas />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex justify-between">
            Vendas por Loja
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setOrdemDescLoja(!ordemDescLoja)}
            >
              Ordenar {ordemDescLoja ? "Crescente" : "Decrescente"}
            </button>
          </h2>
          <RankingLojas />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-bold mb-4">Ranking de Vendas</h2>
          <RankingFuncionarios />
        </div>
      </div>
    </div>
  );
}
