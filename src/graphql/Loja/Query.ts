import { useQuery } from "@apollo/client";
import { TypesGetLojasFields } from "./Types";
import { GET_LOJAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetLojas() {

  const { data, error, loading } = useQuery<TypesGetLojasFields>(
    GET_LOJAS);

  return { data, error, loading };
}
