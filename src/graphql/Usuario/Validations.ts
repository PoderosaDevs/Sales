import { z } from "zod";

// Regex para validação de nome, CPF, telefone e CEP
const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Aceita letras maiúsculas, minúsculas e acentos
const cpfRegex = /^[0-9]{11}$/; // Verifica se contém apenas 11 dígitos numéricos
const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/; // Formato: (99) 99999-9999 ou (99) 9999-9999
const cepRegex = /^[0-9]{8}$/; // Verifica se contém 8 dígitos numéricos

// Função para validar se o CPF é válido (usando o cálculo dos dígitos verificadores)
const isValidCPF = (cpf: string) => {
  let sum = 0;
  let remainder;

  // Elimina CPFs conhecidos como inválidos
  if (cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222" || 
      cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" ||
      cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888" || 
      cpf === "99999999999") {
    return false;
  }

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Esquema de validação para o login
export const LoginFieldsFormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional(),
});

export type LoginFieldsFormData = z.infer<typeof LoginFieldsFormSchema>;

// Esquema de validação para o formulário de criação de usuário
export const SetUsuarioFieldsFormSchema = z.object({
  nome: z.string()
    .regex(nomeRegex, "O nome deve conter apenas letras.")
    .nonempty("Por favor, preencha seu nome completo."),
  
  cpf: z.string()
    .regex(cpfRegex, "O CPF deve conter apenas números e ter 11 dígitos.")
    .refine(isValidCPF, { message: "O CPF é inválido." }), // Valida se o CPF é válido

  email: z.string().email("Por favor, insira um email válido."),
  
  numero: z.string().optional(), // Campo opcional para número
  
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  
  telefone: z.string()
    .regex(telefoneRegex, "O telefone deve seguir o formato (99) 99999-9999 ou (99) 9999-9999."),
  
  tipo_pessoa: z.enum(["EMPLOYEE", "MANAGER", "CLIENT", "GUEST"]).default("EMPLOYEE"), // Se tiver valores fixos, use enum
  
  tipo_sistemas_nomes: z.array(z.string()).default(["SALES", "SITE"]),
  
  cep: z.string()
    .regex(cepRegex, "O CEP deve conter 8 dígitos.")
    .default("00000000"),
  
  endereco: z.string().optional(), // Campo opcional para endereço
  
  complemento: z.string().optional(), // Campo opcional para complemento
  
  funcao: z.string().default("Vendedor"),
  
  isWhatsapp: z.boolean().default(false)
});

export type SetUsuarioFieldsFormData = z.infer<typeof SetUsuarioFieldsFormSchema>;
