export interface TypesGetLojasFields {
  GetLojas: {
    id: number
    nome_fantasia: string
    razao_social: string
  }[]
}


export interface TypesSetLojaFields {
  SetLoja: {
    id: number
  }
}

export interface TypesDeleteLojaFields {
  DeleteLoja: {
    id: number
  }
}