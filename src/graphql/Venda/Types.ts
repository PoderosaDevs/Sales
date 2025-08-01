export interface SetVendaUsuarioTypes {
  SetVenda: {
    id: number;
  };
}

export interface GeVendasTypes {
  GetVendas: {
    id: number;
    data_venda: Date;
    pontos_totais: number;
    situacao: boolean;
    funcionario: {
      id: string;
      nome: string;
    };
    venda_detalhe: {
      produto: {
        id: number;
        nome: string;
        imagem: string;
      };
      pontos: number;
      quantidade: number;
    }[];
  }[];
}

export interface GetVendaByUsuarioIDTypes {
  GetVendaByUsuarioID: {
    id: number;
    data_venda: string;
    pontos_totais: number;
    situacao: boolean;
    funcionario: {
      id: string;
      nome: string;
    };
    venda_detalhe: {
      produto: {
        id: number;
        nome: string;
        imagem: string;
      };
      pontos: number;
      quantidade: number;
    }[];
  }[];
}

export interface GeVendaByIDTypes {
  GetVendaByID: {
    id: number;
    data_venda: Date;
    pontos_totais: number;
    situacao: boolean;
    funcionario: {
      id: string;
      nome: string;
    };
    venda_detalhe: {
      produto: {
        id: number;
        nome: string;
        imagem: string;
      }[];
      pontos: number;
      quantidade: number;
    }[];
  };
}

export interface DeleteVendaTypes{
   DeleteVenda: {
      id: number
    }
}
