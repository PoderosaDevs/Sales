export interface TypesGetProdutosFields {
  GetProdutos: {
    result: {
      id: number;
      codigo: string;
      nome: string;
      descricao: string;
      id_marca: number;
      preco: number;
      pontos: number;
      situacao: boolean;
      imagem: string;
      marca: {
        cor: string;
        id: number;
        nome: string;
      }
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

export interface TypesSetProdutosFields {
  SetProduto: {
    id: number;
  };
}

export interface TypesPutProdutosFields {
  PutProduto: {
    id: number;
  };
}

export interface TypesDeleteProdutosFields {
  DeleteProduto: {
    id: number;
  };
}
