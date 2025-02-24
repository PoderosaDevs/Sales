import { useQuery } from "@apollo/client";
import { TypesGetMetasFields } from "./Types";
import { GET_METAS } from "./Schema";

interface QueryProps {
  variables: any
  skip: boolean
}

export function QueryGetMetas({variables, skip}: QueryProps) {
  const { data, error, loading } = useQuery<TypesGetMetasFields>(GET_METAS, {
    variables, // Example variables
    skip
  });

  return { data, error, loading };
}
