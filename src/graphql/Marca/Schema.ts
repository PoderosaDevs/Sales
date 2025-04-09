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
`;

export const GET_RANKING_MARCAS = gql`
  query PageInfo($filters: BrandsInsightsFilterInput) {
    getBrandsInsights(filters: $filters) {
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
      result {
        id
        nome
        total_vendas
      }
    }
  }
`;

export const SET_META = gql`
  mutation SetMarca($nome: String!, $cor: String!) {
    SetMarca(nome: $nome, cor: $cor) {
      id
      nome
    }
  }
`;
