export interface TypesGetProdutosFields {
  GetProdutos: {
    result: {
      id: number;
      codigo: string;
      nome: string;
      descricao: string;
      estoque: number;
      id_fornecedor: number;
      id_marca: number;
      preco: number;
      pontos: number;
      formato: string;
      data_expiracao: Date;
      is_frete_gratis: boolean;
      peso_liquido: number;
      peso_bruto: number;
      largura: number;
      altura: number;
      profundidade: number;
      volumes: number;
      itens_por_caixa: number;
      unidade_de_medida: string;
      situacao: boolean;
      imagem: string;
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
