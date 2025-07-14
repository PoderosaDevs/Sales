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
    }[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface TypesGetLojaInsights {
  GetLojaInsights: {
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
      pontos_totais: number;
      pontos_totais_coloracao: number;
      pontos_totais_tratamento: number;
      marcas: {
        nome: string;
        quantidade: number;
        pontos_tratamento: number;
        pontos_coloracao: number;
      }[];
      vendedores: {
        nome: string;
        quantidade: number;
        pontos_totais_tratamento: number;
        pontos_totais_coloracao: number;
      }[];
    };
  };
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
