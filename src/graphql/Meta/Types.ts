
export interface TypesGetMetasFields {
  GetMetas: {
    id: number
    quantidade: number
    data_inicio: Date
    data_fim: Date
    marca_id: number
    usuario_id: number
    usuarios: {
      id: number
      nome: string
    }[]
    marca: {
      id: number
      nome: string
    }
    situacao: boolean
    etapas: number[]
  }[]
}

export interface TypesSetMetaFields {
  SetMeta: {
    id: number
  }
}