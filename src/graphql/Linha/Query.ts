import { useQuery } from "@apollo/client";
import { TypesGetLinhasFields } from "./Types";
import { GET_LINHAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetLinhas() {

  const { data, error, loading } = useQuery<TypesGetLinhasFields>(
    GET_LINHAS);

  return { data, error, loading };
}
