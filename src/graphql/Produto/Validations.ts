import { z } from "zod";

export const SetProdutoFieldsFormData = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  pontos: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  imagem: z.string().url("URL da imagem é inválida"),
  id_marca: z.number(),
  situacao: z.boolean().default(true)
});

export const formSchema = SetProdutoFieldsFormData.pick({
  nome: true,
  codigo: true,
  descricao: true,
  pontos: true,
  imagem: true,
  id_marca: true,
  situacao: true
})

export type FormValues = z.input<typeof formSchema>;
