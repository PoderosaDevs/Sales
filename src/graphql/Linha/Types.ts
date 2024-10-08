export interface TypesGetLinhasFields {
    GetLinhas: {
      id: number
      nome: string
      produtos: {
        id: number
        nome: string
      }
      marca: {
        id: number
        nome: string
      }
    }[]
}


export interface TypesSetLinhaFields {
  SetLinha: {
    id: number
    nome: string
  }
}