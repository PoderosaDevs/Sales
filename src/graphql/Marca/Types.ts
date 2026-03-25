
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

export interface TypesGetMarcaInsights {
  GetMarcaInsights: {
    result: {
      id: number
      nome: string
      pontos_totais: number
      pontos_totais_coloracao: number
      pontos_totais_tratamento: number
      lojas: {
        pontos_totais_tratamento: number
        pontos_totais_coloracao: number
        pontos_totais: number
        nome_fantasia: string
      }[]
      vendedores: {
        nome: string
        pontos_totais_coloracao: number
        pontos_totais_tratamento: number
        quantidade: number
      }[]
    }
    pageInfo: {
      currentPage: number
      totalPages: number
      totalItems: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}