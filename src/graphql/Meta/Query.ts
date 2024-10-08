import { useQuery } from "@apollo/client";
import { TypesGetMetasFields } from "./Types";
import { GET_METAS } from "./Schema";

interface QueryProps {
  variables: any
}

export function QueryGetMetas() {
  const { data, error, loading } = useQuery<TypesGetMetasFields>(GET_METAS);

  return { data, error, loading };
}
