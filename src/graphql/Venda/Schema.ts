import { gql } from "@apollo/client";

export const SET_VENDA_SCHEMA = gql`
mutation SetVenda($data: VendaInput!) {
  SetVenda(data: $data) {
    id
  }
}
`

export const GET_VENDAS_SCHEMA = gql`
query GetVendas($startDate: Date, $endDate: Date) {
  GetVendas(startDate: $startDate, endDate: $endDate) {
    id
    data_venda
    pontos_totais
    situacao
    funcionario {
      id
      nome
    }
    venda_detalhe {
      produto {
        id
        nome
        imagem
      }
      pontos
      quantidade
    }
  }
}
`


export const GET_VENDA_BY_ID = gql`
query GetVendaByID($getVendaByIdId: Float!) {
  GetVendaByID(id: $getVendaByIdId) {
    id
    data_venda
    pontos_totais
    situacao
    funcionario {
      id
      nome
    }
    venda_detalhe {
      produto {
        id
        nome
        imagem
      }
      pontos
      quantidade
    }
  }
}
`

export const GET_VENDA_BY_USUARIO_ID = gql`
query GetVendaByUsuarioID($getVendaByUsuarioIdId: Float!, $dataMensal: String) {
  GetVendaByUsuarioID(id: $getVendaByUsuarioIdId, data_mensal: $dataMensal) {
    id
    data_venda
    pontos_totais
    situacao
    funcionario {
      id
      nome
    }
    venda_detalhe {
      produto {
        id
        nome
        imagem
      }
      pontos
      quantidade
    }
  }
}
`