import { z } from "zod";

// Validação de cada etapa
const EtapaSchema = z.object({
  importancia: z.number().nullable().optional(), // Permite null ou número
  quantidade: z.number().nullable().optional(),  // Permite null ou número
  recompensa: z.string().nullable().optional(),  // Permite null ou string
  valor: z.number().nullable().optional(), // Permite null ou número
  etapa_numero: z.number().nullable().optional(), // Permite null ou número
});

export const SetMetaFieldsFormData = z.object({
  nome: z
    .string({
      required_error: 'O campo "nome" é obrigatório.',
      invalid_type_error: 'O campo "nome" deve ser um texto.',
    }),
  quantidade_total: z
    .number({
      required_error: 'O campo "quantidade_total" é obrigatório.',
      invalid_type_error: 'O campo "quantidade_total" deve ser um número.',
    })
    .positive('O campo "quantidade_total" deve ser um número positivo.'), // Garantir que seja um número positivo
  descricao: z
    .string({
      required_error: 'O campo "descricao" é obrigatório.',
      invalid_type_error: 'O campo "descricao" deve ser uma string.',
    })
    .min(5, 'A descrição deve ter no mínimo 5 caracteres.'), // Adicionando validação de tamanho mínimo
  data_inicio: z
    .string({
      required_error: 'O campo "data_inicio" é obrigatório.',
      invalid_type_error: 'O campo "data_inicio" deve ser uma string (data).',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'O campo "data_inicio" deve ser uma data válida.',
    }), // Validar se é uma data válida
  data_fim: z
    .string({
      required_error: 'O campo "data_fim" é obrigatório.',
      invalid_type_error: 'O campo "data_fim" deve ser uma string (data).',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'O campo "data_fim" deve ser uma data válida.',
    }), // Validar se é uma data válida
  marca_id: z
    .number({
      required_error: 'O campo "marca_id" é obrigatório.',
      invalid_type_error: 'O campo "marca_id" deve ser um número.',
    })
    .positive('O campo "marca_id" deve ser um número positivo.') // Garantir que seja um número positivo
    .optional(),
  usuario_id: z
    .number({
      required_error: 'O campo "usuarios_id" é obrigatório.',
      invalid_type_error: 'O campo "usuarios_id" deve ser um número.',
    })
    .positive('O campo "usuarios_id" deve ser um número positivo.'), // Garantir que seja um número positivo
  situacao: z.boolean().default(true), // Valor padrão para situacao (true)
  etapas: z
    .array(EtapaSchema) // Define que "etapas" deve ser um array de objetos de Etapa
    .nonempty('O campo "etapas" deve ter pelo menos uma etapa.') // Valida que o array não pode estar vazio
    .optional(), // Pode ser omitido
});

export type SetMetaFieldsFormInputs = z.infer<typeof SetMetaFieldsFormData>;
