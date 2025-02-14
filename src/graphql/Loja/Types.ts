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
