import { useMutation } from "@apollo/client";
import { TypesSetMetaFields } from "./Types";
import { GET_METAS, SET_META } from "./Schema";
// import { GET_FUNCIONARIOS } from "./Queries"; // <- se precisar de outra

export function useMutationSetMeta() {
  const [mutationSetMeta, { error, loading, data }] =
    useMutation<TypesSetMetaFields>(SET_META, {
      awaitRefetchQueries: true,      // garante que espere as refetches
    });

  /* ------------ Envia o formulário ------------ */
  async function FormSetMeta(formData: any) {
    try {
      const {
        nome,
        descricao,
        quantidade_objetivo,
        data_inicio,
        data_fim,
        marcaId,
        usuarioId,
        etapas,
      } = formData;

      const etapasValidadas = Array.isArray(etapas) ? etapas : [];

      const variables = {
        data: {
          nome,
          descricao: descricao ?? null,
          quantidade_objetivo: quantidade_objetivo ?? null,
          data_inicio,
          data_fim,
          marcaId: marcaId ?? null,
          usuarioId: usuarioId ?? null,
          etapas: etapasValidadas.map((etapa: any, idx: number) => ({
            nome: etapa.nome ?? `Nivel ${idx + 1}`,
            quantidade_objetivo: etapa.quantidade_objetivo ?? null,
          })),
        },
      };

      /* --------- mutation + refetch --------- */
      return await mutationSetMeta({
        variables,
        refetchQueries: [
          {
            query: GET_METAS,
            variables: { usuarioId }, // ← mantém a lista de metas do usuário atualizada
          },
          // { query: GET_FUNCIONARIOS },        // ← descomente se quiser atualizar outra lista
        ],
      });
    } catch (e: any) {
      console.error("Erro na requisição:", e.message);
      throw e;
    }
  }

  return { FormSetMeta, loading, error, data };
}
