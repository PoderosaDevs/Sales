import { useQuery } from "@apollo/client";
import { TypesGetProdutosFields } from "./Types";
import { GET_PRODUTO_SCHEMA } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetProdutos({variables}: QueryProps) {

  const { data, error, loading } = useQuery<TypesGetProdutosFields>(
    GET_PRODUTO_SCHEMA,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading };
}
