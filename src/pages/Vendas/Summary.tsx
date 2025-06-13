import React, { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/CartContext";
import { FaMinus, FaPlus, FaTrashAlt, FaTh, FaListUl } from "react-icons/fa";
import Swal from "sweetalert2";
import { CartItem } from "../../context/types/CartContext";
import { useAuth } from "../../context/AuthContext";
import { MutationSetVenda } from "../../graphql/Venda/Mutation";
import { QueryGetLojas } from "../../graphql/Loja/Query";
import { TbShoppingBagExclamation } from "react-icons/tb";
export function Summary() {
  const { cartItems, updateItemQuantity, removeProduct, clearCart } =
    useShoppingCart();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLoja, setSelectedLoja] = useState<string>(""); // Estado para a loja selecionada
  const { usuarioData } = useAuth();

  const { data: dataLojas, loading: loadingLojas } = QueryGetLojas({
    variables: {
      pagination: {
        pagina: 0,
        quantidade: 30,
      },
    },
  });

  // Calcular o total de pontos
  const calculateTotalPoints = () => {
    let total = 0;
    let totalQuantity = 0;

    cartItems.forEach((item: CartItem) => {
      total += item.pontos * item.quantidade;
    });

    cartItems.forEach((item: CartItem) => {
      totalQuantity += item.quantidade; // Calcula o total de itens
    });

    setTotalPoints(total);
    setTotalItems(totalQuantity);
  };

  // Atualizar a quantidade do item
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(id, newQuantity);
      calculateTotalPoints();
    }
  };

  // Manipular a mudança manual de quantidade
  const handleInputChange = (id: string, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateItemQuantity(id, newQuantity);
      calculateTotalPoints();
    }
  };

  // Remover um item do carrinho com confirmação
  const handleRemoveItem = (id: string) => {
    Swal.fire({
      title: "Tem certeza?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#176404",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Remover",
    }).then((result) => {
      if (result.isConfirmed) {
        removeProduct(id);
        Swal.fire("Removido!", "O item foi removido do carrinho.", "success");
      }
    });
  };

  // Calcular pontos total ao inicializar
  useEffect(() => {
    calculateTotalPoints();
  }, [cartItems]);

  // Atualizar a data selecionada
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const { FormSetVenda, loading } = MutationSetVenda();

  if (loading) {
    Swal.fire("Enviando Informações...", "");
    Swal.showLoading();
  }

  // Coletar dados e finalizar
  const handleFinalize = async () => {
    if (!selectedDate || !selectedLoja) {
      return Swal.fire(
        "Erro",
        "Selecione uma data e uma loja antes de finalizar.",
        "error"
      );
    }

    const vendaData = {
      funcionarioId: usuarioData?.id,
      data_venda: selectedDate,
      lojaId: parseInt(selectedLoja), // Adiciona a loja selecionada
      vendaDetalhes: cartItems.map((item: CartItem) => ({
        produtoId: parseInt(item.id),
        quantidade: item.quantidade,
      })),
    };

    try {
      const result = await FormSetVenda(vendaData);
      console.log(result);
      // Verifica se há erros no result
      if (result?.errors && result.errors.length > 0) {
        let errorMessage = result.errors[0]?.message || "Erro desconhecido.";

        // Verifica se o erro está relacionado ao email já cadastrado
        if (result.errors[0]?.message === "Email já cadastrado no sistema!") {
          errorMessage = "Esse email já está cadastrado. Tente outro.";
        }

        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: errorMessage,
        });
        return; // Para a execução em caso de erro
      }
      Swal.fire("Sucesso", "Venda concluída com sucesso!", "success").then(
        () => {
          clearCart(); // Limpar o carrinho quando o Swal é fechado
        }
      );
    } catch (error) {
      Swal.fire("Erro", "Ocorreu um erro ao finalizar a venda.", "error").then(
        () => {
          clearCart(); // Limpar o carrinho mesmo em caso de erro
        }
      );
      console.error(error);
    }
  };

  const isFinalizeButtonDisabled =
    !selectedDate || !selectedLoja || cartItems.length === 0;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-lg">
      <div className="flex justify-between items-center mb-4 pb-4 border-b flex-col gap-4 md:flex-row md:gap-0">
        <div className="flex items-center flex-col gap-4 md:flex-row md:gap-0">
          <div className="flex justify-between">
            <span className="font-semibold text-xl">Total de Pontos:</span>
            <span className="text-xl ml-2 text-custom-bg-start font-semibold">
              {totalPoints}
            </span>
          </div>
          <div className="flex justify-between px-2">
            <span className="font-semibold text-xl">Total de Itens:</span>
            <span className="text-xl ml-2 text-custom-bg-start font-semibold">
              {totalItems}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className={`p-2 ${
              viewMode === "grid"
                ? "bg-gray-200 text-custom-bg-start"
                : "bg-white"
            } rounded`}
            onClick={() => setViewMode("grid")}
          >
            <FaTh className="text-lg" />
          </button>
          <button
            className={`p-2 ${
              viewMode === "list"
                ? "bg-gray-200 text-custom-bg-start"
                : "bg-white"
            } rounded`}
            onClick={() => setViewMode("list")}
          >
            <FaListUl className="text-lg" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto">
        {cartItems.length > 0 ? (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                : "flex flex-col gap-4 max-h-80"
            }`}
          >
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className={`bg-gray-100 rounded-lg shadow-md flex ${
                  viewMode === "grid"
                    ? "flex-col p-4 max-w-xs mx-auto"
                    : "items-center p-4"
                } ${viewMode === "list" ? "border border-gray-200" : ""}`}
              >
                {viewMode === "list" ? (
                  <>
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.nome}</span>
                          <span className="text-gray-600">
                            Pontos: {item.pontos}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                        <button
                          className="text-gray-700 px-2 py-1 rounded-l bg-gray-300 hover:bg-gray-400"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantidade - 1)
                          }
                          disabled={item.quantidade <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="text"
                          value={item.quantidade}
                          onChange={(e) =>
                            handleInputChange(item.id, e.target.value)
                          }
                          className="w-12 text-center border-t border-b border-gray-300 bg-white"
                        />
                        <button
                          className="text-gray-700 px-2 py-1 rounded-r bg-gray-300 hover:bg-gray-400"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantidade + 1)
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 flex flex-col">
                      <span className="font-semibold text-xl">{item.nome}</span>
                      <span className="text-gray-600 text-xl">
                        Pontos: {item.pontos}
                      </span>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                          <button
                            className="text-gray-600 px-2 py-1 rounded-l bg-transparent hover:text-gray-900"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantidade - 1)
                            }
                            disabled={item.quantidade <= 1}
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="text"
                            value={item.quantidade}
                            onChange={(e) =>
                              handleInputChange(item.id, e.target.value)
                            }
                            className="w-12 text-center text-xl bg-transparent border-none border-gray-300"
                          />
                          <button
                            className="text-gray-600 px-2 py-1 rounded-r bg-transparent hover:text-gray-900"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantidade + 1)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 flex-col text-gray-500 text-2xl">
            <TbShoppingBagExclamation size={64} />
            Nenhum produto no carrinho
          </div>
        )}
      </div>

      <div className="flex border-t pt-2 flex-col mt-4">
        <div className="flex flex-col justify-between flex-wrap sm:flex-row items-center w-full">
          <div className="flex flex-row items-center w-full lg:w-auto justify-between mb-2 lg:mb-0">
            <label htmlFor="loja" className="block text-xl mr-2 font-semibold">
              Loja:
            </label>
            <select
              className="border border-gray-300 bg-white shadow-md w-60 px-3 py-2 text-start text-lg outline-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition ease-in-out"
              id="loja"
              name="loja"
              value={selectedLoja}
              onChange={(e) => setSelectedLoja(e.target.value)} // Atualiza o estado da loja selecionada
            >
              <option value="" className="text-gray-500">
                Selecione uma loja
              </option>
              {dataLojas?.GetLojas.result.map((loja) => (
                <option key={loja.id} value={loja.id} className="text-gray-800">
                  {loja.nome_fantasia}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row items-center w-full lg:w-auto justify-between">
            <label htmlFor="date" className="block text-xl mr-2 font-semibold">
              Data da venda:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border w-64 text-center outline-none text-xl rounded-lg p-2 mt-1"
              disabled={cartItems.length === 0} // Desativa o input se o carrinho estiver vazio
            />
          </div>
        </div>

        <button
          onClick={handleFinalize}
          disabled={isFinalizeButtonDisabled}
          className={`mt-4 px-4 py-2 rounded-lg text-2xl text-white ${
            isFinalizeButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
