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
