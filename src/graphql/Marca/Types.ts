
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

export interface TypesRankingMarcasFields {
  getBrandsInsights: {
    pageInfo: {
      currentPage: number
      totalPages: number
      totalItems: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    result: {
      id: number
      nome: string
      total_vendas: number
    }[]
  }
}

export interface TypesSetMarcaFields {
  SetMarca: {
    id: number
    nome: string
  }
}