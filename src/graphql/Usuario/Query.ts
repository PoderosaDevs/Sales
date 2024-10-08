import { useQuery } from "@apollo/client";
import { GetFuncionarioFieldsTypes } from "./Types";
import { GET_FUNCIONARIO_SCHEMA } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetFuncionarios({variables}: QueryProps) {

  const { data, error, loading } = useQuery<GetFuncionarioFieldsTypes>(
    GET_FUNCIONARIO_SCHEMA,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading };
}
