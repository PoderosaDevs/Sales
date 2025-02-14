import { gql } from "@apollo/client";

export const GET_MARCAS = gql`
query GetMarcas {
  GetMarcas {
    id
    nome
    cor
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
mutation SetMarca($nome: String!, $cor: String!) {
  SetMarca(nome: $nome, cor: $cor) {
    id
    nome
  }
}
`