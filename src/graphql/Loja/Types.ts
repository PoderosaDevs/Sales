export interface TypesGetLojasFields {
  GetLojas: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: number;
      nome_fantasia: string;
      razao_social: string;
    }[];
  };
}

export interface TypesRankingLojasTypes {
  getStoresInsights: {
    result: {
      id: number;
      nome: string;
      total_vendas: number;
    }[]
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  }
}


export interface TypesGetLojaInsights {
  GetLojaInsights: {
      pageInfo: {
        currentPage: number
        totalPages: number
        totalItems: number
        hasNextPage: boolean
        hasPreviousPage: boolean
      }
      result: {
        nome_fantasia: string
        pontos_totais: number
        marca: {
          nome: string
          quantidade: number
        }[]
        vendedores: {
          nome: string
          quantidade: number
        }[]
      }
    }
}

export interface TypesSetLojaFields {
  SetLoja: {
    id: number;
  };
}

export interface TypesDeleteLojaFields {
  DeleteLoja: {
    id: number;
  };
}
