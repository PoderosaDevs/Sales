import { gql } from "@apollo/client";

export const LOGIN_SCHEMA = gql`
mutation Login($usuario: AutenticacaoInput!) {
  Login(usuario: $usuario) {
    id
    email
    nome
    token_api
  }
}
`

export const CREATE_USUARIO_SCHEMA = gql`
mutation SetVendedor($data: UsuarioInput!) {
  SetVendedor(data: $data) {
    id
  }
}
`

export const GET_FUNCIONARIO_SCHEMA = gql`
query GetUsuarios($tipoPessoa: String) {
  GetUsuarios(Tipo_Pessoa: $tipoPessoa) {
    id
    email
    cpf
    data_nascimento
    nome
    funcao
  }
}
`

export const GET_RANKING_FUNCIONARIOS = gql`
query GetUsuariosInsights($pagination: Pagination) {
  GetUsuariosInsights(pagination: $pagination) {
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
      email
      pontos_totais
    }
  }
}

`