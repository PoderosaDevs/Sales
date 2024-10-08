import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_VENDAS_SCHEMA, GET_VENDA_BY_ID, GET_VENDA_BY_USUARIO_ID } from "./Schema";
import { GeVendasTypes, GeVendaByIDTypes, GetVendaByUsuarioIDTypes } from "./Types";

interface QueryProps {
  variables: any
  skip?: boolean
}

export function QueryGetVendas({ variables }: { variables?: any }) {
  const [getVendasData, { data, error, loading }] = useLazyQuery<GeVendasTypes>(GET_VENDAS_SCHEMA, {
    variables,
    fetchPolicy: "network-only",
  });

  return { getVendasData, data, error, loading };
}


export function QueryGetVendaByID({variables}: QueryProps) {

  const { data, error, loading } = useQuery<GeVendaByIDTypes>(
    GET_VENDA_BY_ID,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading };
}


export function QueryGetVendasByUsuarioID({variables}: QueryProps) {

  const { data, error, loading } = useQuery<GetVendaByUsuarioIDTypes>(
    GET_VENDA_BY_USUARIO_ID,
    {
      variables,
      fetchPolicy: "network-only", // Evita cachear dados já carregados
    }
  );

  return { data, error, loading };
}
