enum MetaSituacao {
  "PENDENTE",
  "ANDAMENTO",
  "CONCLUIDA",
}

export interface TypesGetMetasFields {
  GetMetas: {
    id: number;
    nome: string;
    descricao: string;
    data_inicio: Date;
    data_fim: Date;
    marcaId: number;
    usuarioId: number;
    quantidade_atual: number;
    quantidade_objetivo: number;
    situacao: MetaSituacao;
    meta_etapas: {
      id: number;
      nome: string
      quantidade_objetivo: number;
      quantidade_atual: number;
      atingida: boolean;
    }[];
  }[];
}

export interface TypesSetMetaFields {
  SetMeta: {
    id: number;
  };
}
