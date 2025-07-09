import { z } from "zod";

/* ---------- Etapa ---------- */
export const MetaEtapaSchema = z.object({
  /** Nome da etapa - não pode ser vazio */
  nome: z.string().min(1, "Nome é obrigatório"),

  /** Quantidade-objetivo - inteiro positivo */
  quantidade_objetivo: z.number().int().positive(),
});

/* ---------- Meta (criação) ---------- */
export const CreateMetaSchema = z
  .object({
    /** Nome da meta */
    nome: z.string().min(1, "Nome é obrigatório"),

    /** FK para Marca */
    marcaId: z.number().int().positive(),

    /** Quantidade-objetivo da meta */
    quantidade_objetivo: z.number().int().positive(),

    /** Datas em ISO-8601 ou Date – convertidas para Date */
    data_inicio: z.coerce.date(),
    data_fim: z.coerce.date(),

    /** FK para Usuário */
    usuarioId: z.number().int().positive(),

    /** Descrição opcional */
    descricao: z.string().optional(),

    /** Etapas opcionais (pode omitir ou enviar array vazio) */
    etapas: z.array(MetaEtapaSchema).optional(),
  })
  /* Regra extra: data_fim deve ser posterior a data_inicio */
  .superRefine(({ data_inicio, data_fim }, ctx) => {
    if (data_fim < data_inicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_fim"],
        message: "data_fim deve ser posterior a data_inicio",
      });
    }
  });

/* ---------- Tipos TypeScript derivados ---------- */
export type MetaEtapaInput = z.infer<typeof MetaEtapaSchema>;
export type CreateMetaInput = z.infer<typeof CreateMetaSchema>;
