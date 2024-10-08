import { z } from "zod";

// Validação da primeira etapa: Nome e Imagem da Marca
const StepOneSchema = z.object({
  nome: z.string({
    required_error: 'O campo "nome" é obrigatório.',
    invalid_type_error: 'O campo "nome" deve ser um texto.',
  }).nonempty('O nome da marca não pode estar vazio.'),
  imagem: z.string({
    required_error: 'O campo "imagem" é obrigatório.',
    invalid_type_error: 'O campo "imagem" deve ser um texto.',
  }).nonempty('A imagem da logo é obrigatória.'),
});

// Validação da segunda etapa: Associação de Produtos
const StepTwoSchema = z.object({
  produtos: z
    .array(z.string({
      required_error: 'É necessário associar ao menos um produto.',
      invalid_type_error: 'O campo "produto" deve ser um texto.',
    }))
    .min(1, 'Associe pelo menos um produto à marca.'),
});

// Validação final combinada (se desejado, para submissão final)
export const SetMarcaFieldsFormData = z.object({
  stepOne: StepOneSchema,
  stepTwo: StepTwoSchema,
});

// Tipos para os dados de cada step e para o formulário final
export type StepOneInputs = z.infer<typeof StepOneSchema>;
export type StepTwoInputs = z.infer<typeof StepTwoSchema>;
export type SetMarcaFieldsFormInputs = z.infer<typeof SetMarcaFieldsFormData>;
