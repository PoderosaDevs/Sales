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
`;

export const GET_RANKING_LOJAS = gql`
  query GetStoresInsights($filters: StoresInsightsFilterInput) {
    getStoresInsights(filters: $filters) {
      result {
        id
        nome
        total_vendas
      }
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_LOJA_INSIGHTS = gql`
 query GetLojaInsights($filters: LojaInsightsFiltroInput) {
  GetLojaInsights(filters: $filters) {
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
    result {
      id
      nome_fantasia
      razao_social
      pontos_totais
      pontos_totais_coloracao
      pontos_totais_tratamento
      marcas {
        nome
        quantidade
        pontos_tratamento
        pontos_coloracao
      }
      vendedores {
        nome
        quantidade
        pontos_totais_tratamento
        pontos_totais_coloracao
      }
    }
  }
}
`;

export const SET_LOJA = gql`
  mutation SetLoja($data: CreateLojaInput!) {
    SetLoja(data: $data) {
      id
    }
  }
`;

export const DELETE_LOJA = gql`
  mutation DeleteLoja($deleteLojaId: Int!) {
    DeleteLoja(id: $deleteLojaId) {
      id
    }
  }
`;
