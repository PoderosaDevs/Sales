import { gql } from "@apollo/client";

export const GET_LINHAS = gql`
query GetLinhas {
  GetLinhas {
    id
    nome
    produtos {
      id
      nome
    }
    marca {
      id
      nome
    }
  }
}
`

export const SET_LINHA = gql`
mutation SetLinha($data: LinhaCreateInput!) {
  SetLinha(data: $data) {
    id
    nome
  }
}
`