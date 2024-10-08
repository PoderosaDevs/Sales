import { useQuery } from "@apollo/client";
import { TypesGetMarcasFields } from "./Types";
import { GET_MARCAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetMarcas() {
  const { data, error, loading } = useQuery<TypesGetMarcasFields>(GET_MARCAS);

  return { data, error, loading };
}
