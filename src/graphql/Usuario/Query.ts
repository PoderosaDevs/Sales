import { useQuery } from "@apollo/client";
import { GetFuncionarioFieldsTypes, GetFuncionarioInsightsTypes, GetInsightsVendasPeriodosTypes, GetRankingFuncionariosTypes } from "./Types";
import { GET_FUNCIONARIO_INSIGHTS, GET_FUNCIONARIO_SCHEMA, GET_INSIGHTS_VENDAS_PERIODO, GET_RANKING_FUNCIONARIOS } from "./Schema";

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

export function QueryFuncionarioInsights({variables}: QueryProps) {

  const { data, error, loading, refetch } = useQuery<GetFuncionarioInsightsTypes>(
    GET_FUNCIONARIO_INSIGHTS,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading, refetch };
}

export function QueryGetInsightsVendasPeriodos({variables}: QueryProps) {
 
   const { data, refetch, loading } = useQuery<GetInsightsVendasPeriodosTypes>(
     GET_INSIGHTS_VENDAS_PERIODO,
      {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
   );
  return { data, loading, refetch };
}