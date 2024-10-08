import { gql } from "@apollo/client";

export const GET_PRODUTO_SCHEMA = gql`
query GetProdutos($tipoSistema: String, $categorias: [String!], $marca: String, $pagination: Pagination) {
  GetProdutos(tipo_sistema: $tipoSistema, categorias: $categorias, marca: $marca, pagination: $pagination) {
   result {
    id
    codigo
    nome
    descricao
    estoque
    id_fornecedor
    id_marca
    preco
    pontos
    formato
    data_expiracao
    is_frete_gratis
    peso_liquido
    peso_bruto
    largura
    altura
    profundidade
    volumes
    itens_por_caixa
    unidade_de_medida
    situacao
    imagem
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
export const SET_PRODUTO_SCHEMA = gql`
mutation SetProduto($data: ProdutoInput!) {
  SetProduto(data: $data) {
    id
  }
}
`

export const DELETE_PRODUTO_SCHEMA = gql`
mutation DeleteProduto($deleteProdutoId: String!) {
  DeleteProduto(id: $deleteProdutoId) {
    id
  }
}
`