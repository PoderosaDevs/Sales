
export interface TypesGetMetasFields {
  GetMetas: {
    id: number; // ID da meta
    nome: string; // Nome da meta
    descricao: string; // Descrição da meta
    usuario_id: number; // ID do usuário relacionado
    data_inicio: Date; // Data de início
    data_fim: Date; // Data de fim
    pontos_objetivo: number; // Pontos associados à meta
    marcaId: number; // ID da marca associada
    meta_etapas: {
      id: number; // ID da etapa
      meta_id: number; // ID da meta
      etapa_numero: number; // Número da etapa
      quantidade: number; // Quantidade relacionada à etapa
      recompensa: string; // Recompensa da etapa
      valor: number; // Valor da etapa
      atingida: boolean; // Se a etapa foi atingida (booleano)
      importancia: number; // Importância da etapa (escala ou valor numérico)
    }[]; // Array de etapas associadas à meta
  }[]; // Array de metas
}

export interface TypesSetMetaFields {
  SetMeta: {
    id: number
  }
}