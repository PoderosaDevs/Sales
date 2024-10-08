import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { QueryGetProdutos } from "../../../graphql/Produto/Query";
import { QueryGetMarcas } from "../../../graphql/Marca/Query";

export function LinhaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });

  // Consumindo a query de produtos
  const { data: dataProdutos, loading: loadingProdutos, error: errorProdutos } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  // Consumindo a query de marcas
  const { data: dataMarcas, error: errorMarcas, loading: loadingMarcas } = QueryGetMarcas();

  const handleProductSubmit = async () => {
    try {
      Swal.fire({
        title: "Enviando...",
        text: "Seu produto está sendo cadastrado.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // Lógica de envio do produto
      Swal.fire({
        title: "Sucesso!",
        text: "Produto cadastrado com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        setIsOpen(false);
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao cadastrar o produto.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const toggleProductSelection = (product: any) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const filteredProducts = dataProdutos?.GetProdutos.result.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterBrand || produto.id_marca === parseInt(filterBrand))
  );

  const hasFilters = searchTerm !== "" || filterBrand !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBrand("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3 py-2 bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 rounded-lg">
          <FiPlusSquare size={20} /> Nova Linha
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
            aria-labelledby="dialog-title"
          >
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-300"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            {step === 1 && (
              <div>
                <Dialog.Title id="dialog-title" className="text-xl font-semibold mb-4">
                  Cadastrar Linha
                </Dialog.Title>
                <form onSubmit={() => setStep(2)} className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Nome da Linha"
                      className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                    />
                  </div>
                  <div className="w-full flex justify-end gap-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Fechar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div>
                <Dialog.Title id="dialog-title" className="text-xl font-semibold mb-4">
                  Selecionar Produtos
                </Dialog.Title>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar produtos"
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todas as marcas</option>
                    {dataMarcas?.GetMarcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mb-4 text-sm text-blue-500 hover:underline"
                  >
                    Limpar Filtros
                  </button>
                )}

                {loadingProdutos ? (
                  <p>Carregando produtos...</p>
                ) : errorProdutos ? (
                  <p>Erro ao carregar produtos.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts?.map((produto) => (
                      <div
                        key={produto.id}
                        className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-200 
                          ${selectedProducts.some((p) => p.id === produto.id) ? "bg-purple-100 border-purple-500" : "border-gray-300"}
                        `}
                        onClick={() => toggleProductSelection(produto)}
                      >
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-20 h-20 object-cover mb-4"
                        />
                        <h4 className="text-sm font-semibold">{produto.nome}</h4>
                        <p className="text-gray-500 text-xs">{produto.descricao}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-lg font-semibold">Produtos Selecionados</h4>
                  <div className="mt-2 space-y-2">
                    {selectedProducts.length === 0 ? (
                      <p className="text-gray-500">Nenhum produto selecionado.</p>
                    ) : (
                      selectedProducts.map((produto) => (
                        <div
                          key={produto.id}
                          className="flex items-center justify-between p-2 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-12 h-12 object-cover"
                            />
                            <span>{produto.nome}</span>
                          </div>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => toggleProductSelection(produto)}
                          >
                            Remover
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleProductSubmit}
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
