import { gql } from "@apollo/client";

export const GET_LOJAS = gql`
query GetLojas($pagination: Pagination) {
  GetLojas(pagination: $pagination) {
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
    result {
      nome_fantasia
      razao_social
      id
    }
  }
}

`

export const SET_LOJA = gql`
mutation SetLoja($data: CreateLojaInput!) {
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