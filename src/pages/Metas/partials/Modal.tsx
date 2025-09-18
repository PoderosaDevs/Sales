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
  usuarioIds: number[];
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
  usuarioIds: yup
    .array()
    .of(yup.number())
    .required("Usuários são obrigatórios"),

  descricao: yup.string().optional(),
  etapas: yup.array(MetaEtapaSchema).optional(),
});

export function MetaModal() {
  /* ---------- DEBUG HELPERS ---------- */
  const DEBUG = true;
  const dlog = (...args: any[]) => DEBUG && console.log("[MetaModal]", ...args);
  const dgroup = (label: string) =>
    DEBUG && console.groupCollapsed(`🧪 ${label}`);
  const gend = () => DEBUG && console.groupEnd();

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

  /* ---------- Effects pequenos de debug ---------- */
  React.useEffect(() => {
    dlog("Modal open =", isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    dlog("isMultiple =", isMultiple);
  }, [isMultiple]);

  React.useEffect(() => {
    dlog("selectedMarcas =", selectedMarcas);
  }, [selectedMarcas]);

  React.useEffect(() => {
    dlog("selectedUsuarios =", selectedUsuarios);
  }, [selectedUsuarios]);

  /* ---------- Helpers de etapas ---------- */
  const handleAddTask = () => {
    dgroup("Adicionar Etapa");
    const next = [
      ...tasks,
      {
        id: tasks.length + 1,
        nome: `Etapa ${tasks.length + 1}`,
        quantidade: 1,
      },
    ];
    dlog("Antes:", tasks);
    dlog("Depois:", next);
    gend();
    setTasks(next);
  };

  const handleRemoveTask = (id: number) => {
    dgroup("Remover Etapa");
    dlog("ID:", id);
    dlog("Atual:", tasks);
    const next = tasks.filter((t) => t.id !== id);
    dlog("Resultado:", next);
    gend();
    setTasks(next);
  };

  const handleTaskChange = (
    id: number,
    field: "nome" | "quantidade",
    value: string | number
  ) => {
    dgroup("Alterar Etapa");
    dlog({ id, field, value });
    const next = tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    dlog("Preview:", next);
    gend();
    setTasks(next);
  };

  const handleClearTasks = () => {
    dlog("Limpar etapas → reset para Etapa 1");
    setTasks([{ id: 1, nome: "Etapa 1", quantidade: 1 }]);
  };

  /* ---------- Handlers de input ---------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dgroup("Input change");
    dlog("name:", name, "raw value:", value);
    const next = {
      ...formData,
      [name]: name === "quantidade_objetivo" ? Number(value) : value,
    };
    dlog("formData (prev):", formData);
    dlog("formData (next):", next);
    gend();
    setFormData(next);
  };

  /* ---------- SEND DATA ---------- */
  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    console.count("[MetaModal] submit count");
    console.time("[MetaModal] submit time");
    dgroup("Submit Handler START");
    dlog("event defaultPrevented?", (e as any).defaultPrevented);
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});

    dlog("formData at submit:", formData);
    dlog("selectedMarcas at submit:", selectedMarcas);
    dlog("selectedUsuarios at submit:", selectedUsuarios);
    dlog("tasks at submit:", tasks);
    dlog("isMultiple at submit:", isMultiple);

    // garante number[]
    const usuarioIds: number[] = Array.isArray(selectedUsuarios)
      ? selectedUsuarios
          .map((u) => Number(u?.value)) // coerce "18" -> 18
          .filter((v): v is number => Number.isFinite(v)) // remove NaN
      : [];

    dlog("usuarioIds derivado:", usuarioIds);

    // 1. Monta objeto base
    const basePayload: Partial<CreateMetaInput> = {
      nome: formData.nome,
      quantidade_objetivo: formData.quantidade_objetivo,
      data_inicio: new Date(formData.data_inicio),
      data_fim: new Date(formData.data_fim),
      marcaId: parseInt(String(selectedMarcas?.value)),
      usuarioIds: usuarioIds,
      descricao: formData.descricao || undefined,
    };

    dgroup("Base Payload");
    dlog(basePayload);
    gend();

    // 2. Etapas
    const etapas: MetaEtapaInput[] =
      isMultiple && tasks.length
        ? tasks.map((t) => ({
            nome: (t.nome ?? "").toString().trim() || `Etapa ${t.id}`,
            quantidade_objetivo: Number(t.quantidade),
          }))
        : [
            {
              nome: "Etapa única",
              quantidade_objetivo: Number(formData.quantidade_objetivo),
            },
          ];

    const payload = { ...basePayload, etapas } as CreateMetaInput;

    dgroup("Payload antes da validação");
    dlog(payload);
    gend();

    try {
      // 3) Validação Yup
      await CreateMetaSchema.validate(payload, { abortEarly: false });

      // 4) Ajusta datas ISO
      const inicioISO = payload.data_inicio.toISOString();
      const fimDate = new Date(payload.data_fim);
      fimDate.setHours(23, 59, 59, 0);
      const fimISO = fimDate.toISOString();

      const finalPayload = {
        ...payload,
        data_inicio: inicioISO,
        data_fim: fimISO,
      };

      // 5) Envia para o service (hook já usa errorPolicy: 'all')
      const resp = await FormSetMeta(finalPayload as any);

      if (!resp.ok || !resp.id) {
        const msg = resp.errors?.[0] || "Não foi possível salvar a meta.";
        Swal.fire("Erro", msg, "error");
        return;
      }

      // 6) Sucesso
      Swal.fire("Sucesso!", "Meta salva com sucesso.", "success");

      // 7) Reset
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
      if (err?.name === "ValidationError") {
        const fieldErrors: Record<string, string> = {};
        (err.inner || []).forEach((issue: any) => {
          if (issue.path) fieldErrors[issue.path] = issue.message;
        });
        setErrors(fieldErrors);
        Swal.fire(
          "Erro de validação",
          "Corrija os campos destacados.",
          "warning"
        );
      } else {
        const msg =
          err?.graphQLErrors?.[0]?.message ||
          err?.networkError?.result?.errors?.[0]?.message ||
          err?.networkError?.message ||
          err?.message ||
          "Não foi possível salvar a meta.";
        Swal.fire("Erro", msg, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- JSX ---------- */
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(v) => {
        dlog("onOpenChange:", v);
        setIsOpen(v);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className="px-3 py-2 bg-indigo-600 text-white flex items-center gap-2 rounded-lg"
          onClick={() => dlog("Botão 'Nova Meta' clicado")}
        >
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
              onClick={() => {
                dlog("Fechar modal clicado");
                setIsOpen(false);
              }}
            >
              <X size={24} />
            </button>

            <Dialog.Title className="text-xl font-semibold mb-6">
              Cadastrar Meta
            </Dialog.Title>

            {/* --- FORM --- */}
            <form
              className="space-y-6"
              onSubmit={(ev) => {
                dlog("onSubmit disparou (capturado no form)");
                sendData(ev);
              }}
            >
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
                    onBlur={() => dlog("blur nome:", formData.nome)}
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
                    onBlur={() =>
                      dlog(
                        "blur quantidade_objetivo:",
                        formData.quantidade_objetivo
                      )
                    }
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
                  onBlur={() => dlog("blur descricao:", formData.descricao)}
                />
              </div>

              {/* Selects */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="font-semibold mb-2 block">Marcas</label>
                  <SelectMarcas
                    isMulti={false}
                    setSelectedMarcas={(v: any) => {
                      dlog("SelectMarcas onChange:", v);
                      setSelectedMarcas(v);
                    }}
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
                    onChange={(sel: any) => {
                      dlog("SelectFuncionarios onChange:", sel);
                      setSelectedUsuarios(sel);
                    }}
                  />
                  {/* atenção ao nome do campo: usuarioIds no schema */}
                  {(errors as any).usuarioIds && (
                    <span className="text-red-600 text-sm">
                      {(errors as any).usuarioIds}
                    </span>
                  )}
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
                    onBlur={() =>
                      dlog("blur data_inicio:", formData.data_inicio)
                    }
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
                    onBlur={() => dlog("blur data_fim:", formData.data_fim)}
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
                    dlog("Toggle isMultiple →", !isMultiple);
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
                onClick={() => dlog("Botão submit clicado")}
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
