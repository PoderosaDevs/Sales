import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { Image as ImageIcon, PencilSimple as PencilSimpleIcon, X } from "phosphor-react";
import { SetMarcaFieldsFormInputs } from "../../../graphql/Marca/Validations";
import { FiPlusSquare } from "react-icons/fi";
import { QueryGetProdutos } from "../../../graphql/Produto/Query";
import { MutationSetMeta, SetMarcaType } from "../../../graphql/Marca/Mutation";
import SelectProdutos from "../../../components/selects/SelectProdutos";
import { TypesGetProdutosFields } from "../../../graphql/Produto/Types";

export function MarcaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // Controle da etapa
  const [associatedProducts, setAssociatedProducts] = useState<TypesGetProdutosFields["GetProdutos"]["result"]>([]); // Estado para produtos associados
  const [availableProducts, setAvailableProducts] = useState<TypesGetProdutosFields["GetProdutos"]["result"]>([]); // Estado para produtos disponíveis
  const { errors, handleSubmit, loading, register, reset, FormSetMarca, isSubmitting } = MutationSetMeta();

  const paginacao = { pagina: 1, quantidade: 10 };
  const { data, loading: loadingProdutos, error } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  useEffect(() => {
    if (data && data.GetProdutos) {
      setAvailableProducts(data.GetProdutos.result); // Ajustado para acessar o resultado corretamente
    }
  }, [data]);

  const handleProductAssociation = (product) => {
    setAssociatedProducts((prev) => [...prev, product]);
    setAvailableProducts((prev) => prev.filter((p) => p.id !== product.id)); // Remove produto da lista disponível
  };

  const handleProductDisassociation = (product) => {
    setAssociatedProducts((prev) => prev.filter((p) => p.id !== product.id));
    setAvailableProducts((prev) => [...prev, product]); // Adiciona produto de volta à lista disponível
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleProductSubmit = async (data: SetMarcaType) => {
    try {
      Swal.fire({
        title: "Enviando...",
        text: "Sua marca e produtos estão sendo cadastrados.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      await FormSetMarca({ nome: data.nome, produtos: associatedProducts });
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Marca e produtos cadastrados com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao cadastrar a marca e os produtos.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="p-4 bg-slate-900 text-white font-semibold 
            flex items-center justify-center gap-2 rounded-lg"
        >
          <FiPlusSquare size={20} />
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
            <Dialog.Title id="dialog-title" className="text-xl font-semibold mb-4">
              Cadastrar Marcas
            </Dialog.Title>
            <div className="border w-full mb-6" />

            <form
              onSubmit={handleSubmit(handleProductSubmit)}
              className="space-y-6"
            >
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Nome da Marca"
                  {...register("nome")}
                  className="w-full p-4 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                />
                <p className="text-red-500 text-sm">
                  {errors.nome?.message}
                </p>
              </div>

              {/* Lista de Produtos Disponíveis */}
              <div>
                <h2 className="text-lg font-semibold">Produtos Disponíveis</h2>
                <ul className="space-y-2">
                  {availableProducts.map((product) => (
                    <li key={product.id} className="flex justify-between items-center">
                      <span>{product.nome}</span>
                      <button
                        type="button"
                        onClick={() => handleProductAssociation(product)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Associar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lista de Produtos Associados */}
              <div>
                <h2 className="text-lg font-semibold">Produtos Associados</h2>
                <ul className="space-y-2">
                  {associatedProducts.map((product) => (
                    <li key={product.id} className="flex justify-between items-center">
                      <span>{product.nome}</span>
                      <button
                        type="button"
                        onClick={() => handleProductDisassociation(product)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Desassociar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Salvar
                </button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
