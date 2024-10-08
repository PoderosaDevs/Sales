import { gql } from "@apollo/client";

export const GET_MARCAS = gql`
query GetMarcas {
  GetMarcas {
    id
    nome
    produtos {
      id
      nome
      codigo
      imagem
    }
  }
}
`

export const SET_META = gql`
mutation SetMarca($nome: String!) {
  SetMarca(nome: $nome) {
    id
    nome
  }
}
`