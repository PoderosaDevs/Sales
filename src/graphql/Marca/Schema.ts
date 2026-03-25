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


export const GET_MARCA_INSIGHTS = gql`
query GetMarcaInsights($filters: MarcaInsightsFiltroInput) {
  GetMarcaInsights(filters: $filters) {
    result {
      id
      nome
      pontos_totais
      pontos_totais_coloracao
      pontos_totais_tratamento
      lojas {
        pontos_totais_tratamento
        pontos_totais_coloracao
        pontos_totais
        nome_fantasia
      }
      vendedores {
        nome
        pontos_totais_coloracao
        pontos_totais_tratamento
        quantidade
      }
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

`