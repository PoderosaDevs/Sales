import { useQuery } from "@apollo/client";
import { TypesGetLojasFields } from "./Types";
import { GET_LOJAS } from "./Schema";

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
