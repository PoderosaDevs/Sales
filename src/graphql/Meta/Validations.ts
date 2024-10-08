import { z } from "zod";

export const SetMetaFieldsFormData = z.object({
  quantidade_total: z.number({
    required_error: 'O campo "quantidade_total" é obrigatório.',
    invalid_type_error: 'O campo "quantidade_total" deve ser um número.',
  }),
  descricao: z.string({
    required_error: 'O campo "descricao" é obrigatório.',
    invalid_type_error: 'O campo "descricao" deve ser uma string.',
  }),
  data_inicio: z.string({
    required_error: 'O campo "data_inicio" é obrigatório.',
    invalid_type_error: 'O campo "data_inicio" deve ser uma string (data).',
  }),
  data_fim: z.string({
    required_error: 'O campo "data_fim" é obrigatório.',
    invalid_type_error: 'O campo "data_fim" deve ser uma string (data).',
  }),
  marca_id: z.number({
    required_error: 'O campo "marca_id" é obrigatório.',
    invalid_type_error: 'O campo "marca_id" deve ser um número.',
  }),
  usuarios_id: z.number({
    required_error: 'O campo "usuarios_id" é obrigatório.',
    invalid_type_error: 'O campo "usuarios_id" deve ser um número.',
  }),
  situacao: z.boolean().default(true),
  etapas: z.string().nullable().or(z.string().optional()).optional().or(z.null()).refine((val) => val !== '', {
    message: 'O campo "etapas" pode ser nulo ou uma string válida.',
  }),
});

export type SetMetaFieldsFormInputs = z.infer<
  typeof SetMetaFieldsFormData
>;
