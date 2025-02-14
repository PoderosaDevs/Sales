import { gql } from "@apollo/client";

export const GET_PRODUTO_SCHEMA = gql`
  query GetProdutos(
    $pagination: Pagination
    $categorias: [String!]
    $marca: String
    $pontosMin: Float
    $pontosMax: Float
    $nome: String
  ) {
    GetProdutos(
      pagination: $pagination
      categorias: $categorias
      marca: $marca
      pontos_min: $pontosMin
      pontos_max: $pontosMax
      nome: $nome
    ) {
      result {
        id
        codigo
        nome
        descricao
        id_fornecedor
        id_marca
        preco
        pontos
        situacao
        imagem
        marca {
          cor
          id
          nome
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
`;
export const SET_PRODUTO_SCHEMA = gql`
  mutation SetProduto($data: ProdutoInput!) {
    SetProduto(data: $data) {
      id
    }
  }
`;

export const DELETE_PRODUTO_SCHEMA = gql`
  mutation DeleteProduto($deleteProdutoId: Float!) {
    DeleteProduto(id: $deleteProdutoId) {
      id
    }
  }
`;
