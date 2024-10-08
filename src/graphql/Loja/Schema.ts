import { gql } from "@apollo/client";

export const GET_LOJAS = gql`
query GetLojas {
  GetLojas {
    id
    nome_fantasia
    razao_social
  }
}
`

export const SET_LOJA = gql`
mutation SetLoja($data: LojaCreateInput!) {
  SetLoja(data: $data) {
    id
  }
}
`

export const DELETE_LOJA = gql`
mutation DeleteLoja($deleteLojaId: Int!) {
  DeleteLoja(id: $deleteLojaId) {
    id
  }
}
`