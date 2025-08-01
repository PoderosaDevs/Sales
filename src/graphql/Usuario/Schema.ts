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
`;

export const CREATE_USUARIO_SCHEMA = gql`
  mutation SetVendedor($data: UsuarioInput!) {
    SetVendedor(data: $data) {
      id
    }
  }
`;

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
`;

export const GET_RANKING_FUNCIONARIOS = gql`
  query GetRankingUsuarios($filters: RankingUsuariosFiltroInput) {
    GetRankingUsuarios(filters: $filters) {
      result {
        id
        nome
        email
        tipo_pessoa
        pontos_totais
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

export const GET_FUNCIONARIO_INSIGHTS = gql`
  query GetUsuariosInsights($filters: UsuarioInsightsFiltroInput) {
    GetUsuariosInsights(filters: $filters) {
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
        tipo_pessoa
        pontos_totais
        pontos_totais_coloracao
        pontos_totais_tratamento
        marcas {
          quantidade
          nome
          pontos_tratamento
          pontos_coloracao
        }
        lojas {
          nome
          quantidade
          pontos_tratamento
          pontos_coloracao
        }
      }
    }
  }
`;

export const SET_RECOVERY_PASSWORD = gql`
  mutation RecoveryUsuario($recoveryUsuarioId: Float!, $senha: String!) {
    RecoveryUsuario(id: $recoveryUsuarioId, senha: $senha) {
      id
      nome
    }
  }
`;
