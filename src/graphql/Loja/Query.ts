import { useQuery } from "@apollo/client";
import { TypesGetLojasFields, TypesRankingLojasTypes } from "./Types";
import { GET_LOJAS, GET_RANKING_LOJAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetLojas({variables}: QueryProps) {
  const { data, error, loading } = useQuery<TypesGetLojasFields>(
    GET_LOJAS, {
    variables,
    fetchPolicy: "network-only", // Evita cachear dados já carregados
  });

  return { data, error, loading };
}


export function QueryRankingLojas({variables}: QueryProps) {
  const { data, error, loading } = useQuery<TypesRankingLojasTypes>(
    GET_RANKING_LOJAS, {
    variables,
    fetchPolicy: "network-only", // Evita cachear dados já carregados
  });

  return { data, error, loading };
}
