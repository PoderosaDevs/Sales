import { z } from "zod";

export const SetLinhaFieldsFormData = z.object({
  nome: z.string({
    required_error: 'O campo "nome" é obrigatório.',
    invalid_type_error: 'O campo "nome" deve ser uma string.',
  }),
  marcaId: z.number({
    required_error: 'O campo "marcaId" é obrigatório.',
    invalid_type_error: 'O campo "marcaId" deve ser um número.',
  }),
  produtosIds: z.array(z.number().nonnegative().int(), {
    required_error: 'O campo "produtosIds" é obrigatório.',
    invalid_type_error: 'O campo "produtosIds" deve ser um array de números.',
  }).nonempty('O campo "produtosIds" deve conter pelo menos um ID de produto.'),
  tipo_sistemas_nomes: z.array(z.string().min(1), {
    required_error: 'O campo "tipo_sistemas_nomes" é obrigatório.',
    invalid_type_error: 'O campo "tipo_sistemas_nomes" deve ser um array de strings.',
  }).nonempty('O campo "tipo_sistemas_nomes" deve conter pelo menos um nome de sistema.'),
});

// Define o tipo a partir do esquema
export type SetLinhaFieldsFormInputs = z.infer<typeof SetLinhaFieldsFormData>;