export interface LoginFieldsTypes {
  Login: {
    id: number;
    email: string;
    nome: string;
    token_api: string;
  };
}

export interface SetUsuarioFieldsTypes {
  SetVendedor: {
    id: number;
  };
}

export interface GetFuncionarioFieldsTypes {
  GetUsuarios: {
    id: string;
    email: string;
    cep: string;
    complemento: string;
    cpf: string;
    data_nascimento: string;
    nome: string;
    funcao: string;
    usuario_foto: string;
  }[];
}

export interface GetRankingFuncionariosTypes {
  GetRankingUsuarios: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: number;
      nome: string;
      email: string;
      pontos_totais: number;
    }[];
  };
}

export interface GetFuncionarioInsightsTypes {
  GetUsuariosInsights: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: number;
      nome: string;
      email: string;
      tipo_pessoa: string;
      pontos_totais: number;
      lojas: {
        nome: string;
        quantidade: number;
      }[]
      marcas: {
        nome: string;
        quantidade: number;
      }[]
    };
  };
}
