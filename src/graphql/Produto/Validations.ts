import { z } from "zod";

export const SetProdutoFieldsFormData = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  pontos: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  imagem: z.string().url("URL da imagem é inválida"),
  tipo_sistemas_nomes: z.string().default("SALES"),
  estoque: z.number().default(99151),
  is_frete_gratis: z.boolean().default(true),
  situacao: z.boolean().default(true)
});

export type SetProdutoFieldsFormInputs = z.infer<
  typeof SetProdutoFieldsFormData
>;
