import React, { useState } from "react";
import Swal from "sweetalert2";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { FiPlusSquare } from "react-icons/fi";
import { FaTrash, FaPlus } from "react-icons/fa";
import * as yup from "yup";

import SelectFuncionarios from "../../../components/selects/SelectFuncionarios";
import SelectMarcas from "../../../components/selects/SelectMarcas";
import { useMutationSetMeta } from "../../../graphql/Meta/Mutation";

/* ---------- Tipos auxiliares ---------- */
interface MetaEtapaInput {
  nome: string;
  quantidade_objetivo: number;
}

interface CreateMetaInput {
  nome: string;
  marcaId: number;
  quantidade_objetivo: number;
  data_inicio: Date;
  data_fim: Date;
  usuarioId: number;
  descricao?: string;
  etapas: MetaEtapaInput[];
}

type MarcaOption = { value: number; label: string };
type UsuarioOption = { value: number; label: string };
type Etapa = { id: number; nome: string; quantidade: number };

/* ---------- Yup Schemas ---------- */
const MetaEtapaSchema = yup.object({
  nome: yup.string().required("Nome da etapa é obrigatório"),
  quantidade_objetivo: yup
    .number()
    .integer()
    .positive()
    .required("Quantidade da etapa é obrigatória"),
});

export const CreateMetaSchema = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  marcaId: yup.number().integer().positive().required("Marca é obrigatória"),
  quantidade_objetivo: yup
    .number()
    .integer()
    .positive()
    .required("Quantidade objetivo é obrigatória"),
  data_inicio: yup.date().required("Data de início é obrigatória"),
  data_fim: yup
    .date()
    .required("Data de fim é obrigatória")
    .min(yup.ref("data_inicio"), "data_fim deve ser posterior a data_inicio"),
  usuarioId: yup
    .number()
    .integer()
    .positive()
    .required("Usuário é obrigatório"),
  descricao: yup.string().optional(),
  etapas: yup.array(MetaEtapaSchema).optional(),
});

export function MetaModal() {
  /* ---------- Estados ---------- */
  const [isOpen, setIsOpen] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [tasks, setTasks] = useState<Etapa[]>([
    { id: 1, nome: "Pré-lançamento", quantidade: 1 },
  ]);

  const [selectedMarcas, setSelectedMarcas] = useState<MarcaOption | null>(
    null
  );
  const [selectedUsuarios, setSelectedUsuarios] = useState<UsuarioOption[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    quantidade_objetivo: 0,
    descricao: "",
    data_inicio: "",
    data_fim: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { FormSetMeta } = useMutationSetMeta();
  /* ---------- Helpers de etapas ---------- */
  const handleAddTask = () =>
    setTasks((prev) => [
      ...prev,
      { id: prev.length + 1, nome: `Etapa ${prev.length + 1}`, quantidade: 1 },
    ]);

  const handleRemoveTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleTaskChange = (
    id: number,
    field: "nome" | "quantidade",
    value: string | number
  ) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

  const handleClearTasks = () =>
    setTasks([{ id: 1, nome: "Etapa 1", quantidade: 1 }]);

  /* ---------- Handlers de input ---------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantidade_objetivo" ? Number(value) : value,
    }));
  };

  /* ---------- SEND DATA ---------- */
  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. Monta objeto base
    const basePayload: Partial<CreateMetaInput> = {
      nome: formData.nome,
      quantidade_objetivo: formData.quantidade_objetivo,
      data_inicio: new Date(formData.data_inicio),
      data_fim: new Date(formData.data_fim),
      marcaId: parseInt(String(selectedMarcas?.value)),
      usuarioId: parseInt(String(selectedUsuarios[0]?.value)),
      descricao: formData.descricao || undefined,
    };

    // 2. Etapas
    const etapas: MetaEtapaInput[] =
      isMultiple && tasks.length
        ? tasks.map((t) => ({
            nome: t.nome.trim() || `Etapa ${t.id}`,
            quantidade_objetivo: t.quantidade,
          }))
        : [
            {
              nome: "Etapa única",
              quantidade_objetivo: formData.quantidade_objetivo,
            },
          ];

    const payload = { ...basePayload, etapas } as CreateMetaInput;

    try {
      // 3. Validação Yup
      await CreateMetaSchema.validate(payload, { abortEarly: false });

      /* 4. Ajusta datas ISO */
      const inicioISO = payload.data_inicio.toISOString();
      const fimDate = new Date(payload.data_fim);
      fimDate.setHours(23, 59, 59, 0);
      const fimISO = fimDate.toISOString();

      const finalPayload = {
        ...payload,
        data_inicio: inicioISO,
        data_fim: fimISO,
      };

      console.log("[MetaModal] payload →", finalPayload);

      /* 5. Envia para o seu service  */
      await FormSetMeta(finalPayload); // ← AQUI estamos aguardando!

      /* 6. Alerta de sucesso (agora só dispara após FormSetMeta) */
      Swal.fire("Sucesso!", "Meta salva com sucesso.", "success");

      /* 7. Reset */
      setIsOpen(false);
      setFormData({
        nome: "",
        quantidade_objetivo: 0,
        descricao: "",
        data_inicio: "",
        data_fim: "",
      });
      handleClearTasks();
      setSelectedMarcas(null);
      setSelectedUsuarios([]);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Erros de validação Yup
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((issue: any) => {
          if (issue.path) fieldErrors[issue.path] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        // Erros de requisição ou outros
        console.error(err);
        Swal.fire("Erro", "Não foi possível salvar a meta.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- JSX ---------- */
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3 py-2 bg-indigo-600 text-white flex items-center gap-2 rounded-lg">
          <FiPlusSquare size={20} /> Nova Meta
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            {/* Close */}
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-300"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            <Dialog.Title className="text-xl font-semibold mb-6">
              Cadastrar Meta
            </Dialog.Title>

            {/* --- FORM --- */}
            <form className="space-y-6" onSubmit={sendData}>
              {/* Nome & Quantidade objetivo */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col w-full">
                  <label className="font-semibold mb-2">Nome</label>
                  <input
                    className="w-full px-4 py-2 bg-gray-100 border rounded-lg outline-none"
                    placeholder="Nome da Meta"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                  {errors.nome && (
                    <span className="text-red-600 text-sm">{errors.nome}</span>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <label className="font-semibold mb-2">
                    Quantidade Objetivo
                  </label>
                  <input
                    type="number"
                    name="quantidade_objetivo"
                    value={formData.quantidade_objetivo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-100 border rounded-lg outline-none"
                  />
                  {errors.quantidade_objetivo && (
                    <span className="text-red-600 text-sm">
                      {errors.quantidade_objetivo}
                    </span>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="font-semibold mb-2 block">Descrição</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-100 border rounded-lg outline-none resize-none"
                  rows={4}
                  placeholder="Descrição da meta"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                />
              </div>

              {/* Selects */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="font-semibold mb-2 block">Marcas</label>
                  <SelectMarcas
                    isMulti={false}
                    setSelectedMarcas={setSelectedMarcas}
                  />
                  {errors.marcaId && (
                    <span className="text-red-600 text-sm">
                      {errors.marcaId}
                    </span>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <label className="font-semibold mb-2 block">
                    Funcionários
                  </label>
                  <SelectFuncionarios
                    isMulti={true}
                    onChange={(sel) =>
                      setSelectedUsuarios(Array.isArray(sel) ? sel : [])
                    }
                  />
                  {errors.usuarioId && (
                    <span className="text-red-600 text-sm">
                      {errors.usuarioId}
                    </span>
                  )}
                </div>
              </div>

              {/* Datas */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col w-full">
                  <label className="font-semibold mb-2">Data Início</label>
                  <input
                    type="date"
                    name="data_inicio"
                    value={formData.data_inicio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-100 border rounded-lg outline-none"
                  />
                  {errors.data_inicio && (
                    <span className="text-red-600 text-sm">
                      {errors.data_inicio}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold mb-2">Data Fim</label>
                  <input
                    type="date"
                    name="data_fim"
                    value={formData.data_fim}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-100 border rounded-lg outline-none"
                  />
                  {errors.data_fim && (
                    <span className="text-red-600 text-sm">
                      {errors.data_fim}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta múltipla switch */}
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isMultiple}
                  onChange={() => {
                    setIsMultiple(!isMultiple);
                    if (isMultiple) handleClearTasks();
                  }}
                />
                <span className="font-semibold">Meta Múltipla</span>
              </label>

              {/* Etapas */}
              {isMultiple && (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col md:flex-row md:items-center md:space-x-2"
                    >
                      <input
                        type="text"
                        value={task.nome}
                        onChange={(e) =>
                          handleTaskChange(task.id, "nome", e.target.value)
                        }
                        className="flex-1 p-2 border rounded mb-2 md:mb-0"
                        placeholder={`Nome da Fase ${task.id}`}
                      />
                      <input
                        type="number"
                        value={task.quantidade}
                        onChange={(e) =>
                          handleTaskChange(
                            task.id,
                            "quantidade",
                            Number(e.target.value)
                          )
                        }
                        className="w-32 p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(task.id)}
                        className="bg-red-300 text-red-700 p-2 rounded md:ml-2"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="w-full py-2 bg-purple-500 text-gray-100 font-bold rounded-md flex items-center justify-center"
                  >
                    <FaPlus size={18} className="mr-2" /> Adicionar Fase
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 mt-3 text-white font-semibold rounded-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? "Salvando..." : "Cadastrar Meta"}
              </button>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
