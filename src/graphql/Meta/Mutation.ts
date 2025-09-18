import { useMutation, ApolloError, FetchResult } from "@apollo/client";
import { SET_META } from "./Schema";
// import { TypesSetMetaFields } ... // seus tipos gerados, se houver

type SetMetaResult = {
  ok: boolean;
  id?: number;
  data?: any;
  errors: string[];
  raw?: FetchResult;
};

function parseApolloErrors(err: any): string[] {
  const msgs: string[] = [];
  if (err?.graphQLErrors?.length) {
    msgs.push(...err.graphQLErrors.map((e: any) => e?.message).filter(Boolean));
  }
  const net = err?.networkError as any;
  if (net?.result?.errors?.length) {
    msgs.push(...net.result.errors.map((e: any) => e?.message).filter(Boolean));
  }
  if (net?.message) msgs.push(net.message);
  if (err?.message && msgs.length === 0) msgs.push(err.message);
  return [...new Set(msgs)];
}

export function useMutationSetMeta() {
  const [mutationSetMeta, { loading }] = useMutation(SET_META, {
    // MUITO IMPORTANTE:
    errorPolicy: "all",          // <- não rejeita quando houver data + errors
    awaitRefetchQueries: true,   // espera refetch terminar
  });

  /* ------------ Envia o formulário ------------ */
  async function FormSetMeta(formData: any): Promise<SetMetaResult> {
    try {
      const {
        nome,
        descricao,
        quantidade_objetivo,
        data_inicio,
        data_fim,
        marcaId,
        usuarioIds,
        etapas,
      } = formData;

      // não envie null para campos não-nulos do schema
      const varsEtapas = Array.isArray(etapas)
        ? etapas.map((etapa: any, idx: number) => ({
            nome: etapa?.nome ?? `Nivel ${idx + 1}`,
            quantidade_objetivo: Number(etapa?.quantidade_objetivo ?? 0),
          }))
        : [];

      const variables = {
        data: {
          nome, // string!
          descricao: descricao ?? undefined, // opcional
          quantidade_objetivo: Number(quantidade_objetivo), // Int!
          data_inicio, // ISO string ou Date compatível com seu schema
          data_fim,
          marcaId: Number(marcaId), // Int!
          usuarioIds: (usuarioIds ?? []).map((n: any) => Number(n)), // [Int]!
          etapas: varsEtapas, // opcional conforme schema
        },
      };

  
      const resp = await mutationSetMeta({
        variables,
      });

      // Apollo não lançou. Ainda assim, pode haver errors:
      const apolloErrors = parseApolloErrors(resp);
      const id = resp?.data?.SetMeta?.id as number | undefined;

      return {
        ok: Boolean(id),
        id,
        data: resp?.data,
        errors: apolloErrors,
        raw: resp,
      };
    } catch (err: any) {
      // Apollo lançou (ex.: network error duro)
      const apolloErrors = parseApolloErrors(err);
      return { ok: false, errors: apolloErrors, raw: err };
    }
  }

  return { FormSetMeta, loading };
}
