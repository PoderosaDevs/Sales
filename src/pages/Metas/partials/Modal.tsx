import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { MutationSetMeta } from "../../../graphql/Meta/Mutation";
import { QueryGetMarcas } from "../../../graphql/Marca/Query";
import { SetMetaFieldsFormInputs } from "../../../graphql/Meta/Validations";
import SelectFuncionarios from "../../../components/selects/SelectFuncionarios";
import SelectMarcas from "../../../components/selects/SelectMarcas";
import { FaTrash, FaPlus } from "react-icons/fa";
// Definindo os tipos para as marcas e usuários
type MarcaOption = { value: number; label: string };
type UsuarioOption = { value: number; label: string };

export function MetaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false); // Estado para definir se é meta única ou múltipla
  const [tasks, setTasks] = useState([{ id: 1, quantidade: 1 }]); // Estado para as tarefas
  const [marcas, setMarcas] = useState<MarcaOption[]>([]); // Estado para marcas
  const [selectedMarcas, setSelectedMarcas] = useState<MarcaOption | null>(null);
  const [selectedUsuarios, setSelectedUsuarios] = useState<UsuarioOption[]>([]); // Estado para usuários selecionados

  const {
    errors,
    handleSubmit,
    loading,
    register,
    FormSetMeta,
    reset,
  } = MutationSetMeta();

  // Fetching marcas
  const { data: marcasData, loading: loadingMarcas } = QueryGetMarcas();

  useEffect(() => {
    if (marcasData) {
      setMarcas(marcasData.GetMarcas.map(marca => ({ value: marca.id, label: marca.nome })));
    }
  }, [marcasData]);

  const handleMetaSubmit = async (data: SetMetaFieldsFormInputs) => {
    try {
      Swal.fire({
        title: "Enviando...",
        text: "Sua meta está sendo cadastrada.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // Adiciona marca e usuários ao objeto de dados
      const formData = {
        ...data,
        marca_id: selectedMarcas ? selectedMarcas.value : null, // Mapeia para o valor das marcas selecionadas
        usuarios_id: selectedUsuarios.map(user => user.value),
      };

      await FormSetMeta(formData);
      reset();
      setIsOpen(false);
      Swal.fire({
        title: "Sucesso!",
        text: "Meta cadastrada com sucesso.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => { });
    } catch (e) {
      Swal.fire({
        title: "Erro!",
        text: "Houve um erro ao cadastrar a meta.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleAddTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: prevTasks.length + 1, quantidade: 1 },
    ]);
  };

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskChange = (id: number, value: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, quantidade: value } : task
      )
    );
  };

  const handleClearTasks = () => {
    setTasks([{ id: 1, quantidade: 1 }]);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3 py-2 bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 rounded-lg">
          <FiPlusSquare size={20} /> Nova Meta
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto" aria-labelledby="dialog-title">
            <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-300" aria-label="Close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
            <Dialog.Title id="dialog-title" className="text-xl font-semibold mb-4">
              Cadastrar Meta
            </Dialog.Title>
            <div className="border w-full mb-6" />
            <form onSubmit={handleSubmit(handleMetaSubmit)} className="space-y-6">

              {/* Campos Nome e Quantidade Total lado a lado */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col w-full">
                  <label className="block mb-2 font-semibold">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome"
                    {...register("descricao")}
                    className="w-full  px-4 py-2 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                  />
                  {errors.descricao && (
                    <p className="text-red-500 text-sm">{errors.descricao.message}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="block mb-2 font-semibold">Quantidade Total</label>
                  <input
                    type="number"
                    placeholder="Quantidade Total"
                    {...register("quantidade_total", { valueAsNumber: true })}
                    className="w-full px-4 py-2 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                  />
                  {errors.quantidade_total && (
                    <p className="text-red-500 text-sm">{errors.quantidade_total.message}</p>
                  )}
                </div>
              </div>


              {/* Selects para Marcas e Funcionários */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 font-semibold">Marcas</label>
                  <SelectMarcas
                    isMulti={true}
                    setSelectedMarcas={setSelectedMarcas} // Passando o estado corretamente
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 font-semibold">Funcionários</label>
                  <SelectFuncionarios
                    isMulti={true}
                    onChange={(selected) => {
                      setSelectedUsuarios(Array.isArray(selected) ? selected : []);
                    }}
                  />
                </div>
              </div>

              {/* Campos de Data lado a lado */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col w-full">
                  <label className="block mb-2 font-semibold">Data Início</label>
                  <input
                    type="date"
                    placeholder="Data Início"
                    {...register("data_inicio")}
                    className="w-full  px-4 py-2 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                  />
                  {errors.data_inicio && (
                    <p className="text-red-500 text-sm">{errors.data_inicio.message}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="block mb-2 font-semibold">Data Fim</label>
                  <input
                    type="date"
                    placeholder="Data Fim"
                    {...register("data_fim")}
                    className="w-full  px-4 py-2 outline-none bg-gray-100 text-gray-800 border rounded-lg"
                  />
                  {errors.data_fim && (
                    <p className="text-red-500 text-sm">{errors.data_fim.message}</p>
                  )}
                </div>
              </div>


              {/* Switch para meta múltipla */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isMultiple}
                    onChange={() => {
                      setIsMultiple(!isMultiple);
                      if (!isMultiple) handleClearTasks(); // Limpar metas múltiplas quando desmarcado
                    }}
                    className="mr-2"
                  />
                  Meta Múltipla
                </label>
              </div>

              {/* Tarefas múltiplas */}
              {isMultiple && (
                <div className="mt-4 flex flex-col gap-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center md:w-1/2 gap-2 mb-4">
                      <label className="font-semibold w-20">Fase {task.id}:</label> {/* Tamanho fixo para o label */}
                      <input
                        type="number"
                        value={task.quantidade}
                        onChange={(e) => handleTaskChange(task.id, Number(e.target.value))}
                        className="p-2 border outline-none rounded w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(task.id)}
                        className="bg-red-300 text-red-700 rounded-md p-2 flex items-center"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="bg-green-500 w-full flex items-center justify-center py-2 rounded-md text-gray-900 font-bold"
                  >
                    <FaPlus size={20} className="mr-2" />Adicionar Tarefa
                  </button>
                </div>
              )}


              {/* Botão de submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full  px-4 py-2 text-white font-semibold rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Cadastrando..." : "Cadastrar Meta"}
              </button>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
