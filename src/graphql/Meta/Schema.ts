import { gql } from "@apollo/client";

export const GET_METAS = gql`
query GetMetas($usuarioId: Int!) {
  GetMetas(usuarioId: $usuarioId) {
    id
    nome
    descricao
    usuario_id
    data_inicio
    data_fim
    pontos_objetivo
    meta_etapas {
      id
      meta_id
      etapa_numero
      quantidade
      recompensa
      valor
      atingida
      importancia
    }
    marcaId
  }
}
`

export const SET_META = gql`
mutation SetMeta($etapas: [MetaEtapaInputs!]!, $pontosObjetivo: Float!, $usuarioId: Int!, $nome: String!, $marcaId: Int, $descricao: String) {
  SetMeta(etapas: $etapas, pontos_objetivo: $pontosObjetivo, usuarioId: $usuarioId, nome: $nome, marcaId: $marcaId, descricao: $descricao) {
    id
  }
}
`