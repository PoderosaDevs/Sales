import { useQuery } from "@apollo/client";
import { TypesGetMarcaInsights, TypesGetMarcasFields, TypesRankingMarcasFields } from "./Types";
import { GET_MARCA_INSIGHTS, GET_MARCAS, GET_RANKING_MARCAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetMarcas() {
  const { data, error, loading } = useQuery<TypesGetMarcasFields>(GET_MARCAS);

  return { data, error, loading };
}


export function QueryRankingMarcas({variables}: QueryProps) {
  const { data, error, loading } = useQuery<TypesRankingMarcasFields>(GET_RANKING_MARCAS,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    });

  return { data, error, loading };
}

export function QueryMarcaInsights({variables}: QueryProps) {

  const { data, error, loading, refetch } = useQuery<TypesGetMarcaInsights>(
    GET_MARCA_INSIGHTS,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading, refetch };
}
