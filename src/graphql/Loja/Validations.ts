import { z } from "zod";

export const SetLojaFieldsFormData = z.object({
  nome_fantasia: z.string({
    required_error: 'O campo "nome" é obrigatório.',
    invalid_type_error: 'O campo "nome" deve ser uma string.',
  }),
  razao_social: z.string({
    required_error: 'O campo "razão social" é obrigatório.',
    invalid_type_error: 'O campo "razão social" deve ser uma string.',
  }),
});

// Define o tipo a partir do esquema
export type SetLojaFieldsFormInputs = z.infer<typeof SetLojaFieldsFormData>;