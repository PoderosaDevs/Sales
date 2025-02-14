
export interface TypesGetMarcasFields {
  GetMarcas: {
    id: number
    nome: string
    cor: string
    produtos: {
      id: number
      nome: string
      codigo: string
      imagem: string
    }[] 
  }[]
}

export interface TypesSetMarcaFields {
  SetMarca: {
    id: number
    nome: string
  }
}