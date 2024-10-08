// schemas.ts
import { z } from 'zod';

export const vendaSchema = z.object({
  funcionarioId: z.number().positive().int(),
  data_venda: z.date(),
  vendaDetalhes: z.array(
    z.object({
      produtoId: z.number().positive().int(),
      quantidade: z.number().positive().int(),
    })
  ).nonempty(),
});

export type VendaSchemaTypes = z.infer<typeof vendaSchema>;
