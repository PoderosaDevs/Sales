export type SalesStat = {
  name: string;
  total: number;
  tratamento?: number;
  coloracao?: number;
};

export const mapEmployeeSales = (items: any[]): SalesStat[] =>
  items
    .map((item) => ({
      name: item.nome,
      total: item.quantidade,
      tratamento: item.pontos_tratamento,
      coloracao: item.pontos_coloracao,
    }))
    .sort((a, b) => b.total - a.total);
