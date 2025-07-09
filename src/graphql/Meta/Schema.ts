import { gql } from "@apollo/client";

export const GET_METAS = gql`
  query GetMetas($usuarioId: Int!, $dataInicio: String, $dataFim: String) {
    GetMetas(
      usuarioId: $usuarioId
      data_inicio: $dataInicio
      data_fim: $dataFim
    ) {
      id
      nome
      descricao
      data_inicio
      data_fim
      meta_etapas {
        id
        nome
        quantidade_objetivo
        quantidade_atual
        atingida
      }
      marcaId
      usuarioId
      quantidade_atual
      quantidade_objetivo
      situacao
    }
  }
`;

export const SET_META = gql`
  mutation Mutation($data: CreateMetaInput!) {
    SetMeta(data: $data) {
      id
    }
  }
`;
