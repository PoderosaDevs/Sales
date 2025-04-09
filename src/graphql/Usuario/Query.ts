import { useQuery } from "@apollo/client";
import { GetFuncionarioFieldsTypes, GetRankingFuncionariosTypes } from "./Types";
import { GET_FUNCIONARIO_SCHEMA, GET_RANKING_FUNCIONARIOS } from "./Schema";

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



export function QueryRankingFuncionarios({variables}: QueryProps) {

  const { data, error, loading } = useQuery<GetRankingFuncionariosTypes>(
    GET_RANKING_FUNCIONARIOS,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading };
}