import { gql } from "@apollo/client";

export const GET_METAS = gql`
query GetMetas {
  GetMetas {
    id
    quantidade
    data_inicio
    data_fim
    marca_id
    usuario_id
    usuarios {
      id
      nome
    }
    marca {
      id
      nome
    }
    situacao
    etapas
  }
}
`

export const SET_META = gql`
mutation SetMeta($data: CreateMetaInput!) {
  SetMeta(data: $data) {
    id
  }
}
`