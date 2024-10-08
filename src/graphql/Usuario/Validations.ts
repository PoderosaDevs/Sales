import { z } from "zod";

export const LoginFieldsFormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional(),
});

export type LoginFieldsFormData = z.infer<typeof LoginFieldsFormSchema>;

export const SetUsuarioFieldsFormSchema = z.object({
  nome: z.string().nonempty("Por favor, preencha seu nome completo."),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos."),
  email: z.string().email("Por favor, insira um email válido."),
  numero: z.string().nonempty("O número é obrigatório."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  telefone: z.string().nonempty("O telefone deve seguir o formato esperado."),
  tipo_pessoa: z.string().default("EMPLOYEE"),
  tipo_sistemas_nomes: z.array(z.string()).default(["SALES", "SITE"]),
  cep: z.string().length(8, "O CEP deve conter 8 dígitos.").default("00000000"),
  endereco: z.string().nonempty("O endereço não pode estar vazio.").default("00000000"),
  complemento: z.string().default("00000000"),
});

export type SetUsuarioFieldsFormData = z.infer<typeof SetUsuarioFieldsFormSchema>;
