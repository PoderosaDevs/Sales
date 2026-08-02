export enum TipoPessoa {
  USER = "USER",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  GUEST = "GUEST",
}

export enum MetaSituacao {
  PENDENTE = "PENDENTE",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA = "CANCELADA",
}

export interface Usuario {
  id: number;
  uuid: string;
  nome: string;
  email: string;
  funcao?: string | null;
  tipo_pessoa: TipoPessoa;
  cpf?: string | null;
  data_nascimento?: string | null;
  usuario_foto?: string | null;
  tema?: string | null;
  complemento?: string | null;
  situacao?: boolean;
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Paginated<T> {
  result: T[];
  pageInfo: PageInfo;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Marca {
  id: number;
  nome: string;
  cor: string;
  produtos?: Produto[];
}

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string | null;
  id_marca?: number | null;
  preco?: number | null;
  pontos?: number | null;
  situacao: boolean;
  imagem?: string | null;
  marca?: Marca | null;
  categorias?: Categoria[];
}

export interface Linha {
  id: number;
  nome: string;
  marcaId: number;
  marca?: Marca;
  produtos?: Produto[];
}

export interface Loja {
  id: number;
  nome_fantasia: string;
  razao_social: string;
}

export interface VendaDetalhe {
  id: number;
  produto_id: number;
  quantidade: number;
  pontos: number;
  produto?: Produto;
}

export interface Venda {
  id: number;
  data_venda: string;
  pontos_totais: number;
  situacao: boolean;
  funcionario?: Usuario;
  loja?: Loja;
  venda_detalhe: VendaDetalhe[];
}

export interface MetaEtapa {
  id: number;
  meta_id: number;
  nome: string;
  quantidade_objetivo: number;
  quantidade_atual: number;
  atingida: boolean;
}

export interface Meta {
  id: number;
  nome: string;
  descricao?: string | null;
  quantidade_objetivo: number;
  quantidade_atual: number;
  data_inicio: string;
  data_fim: string;
  situacao: MetaSituacao;
  marcaId: number;
  marca?: Marca;
  meta_etapas: MetaEtapa[];
  usuarios?: { id: number; nome: string }[];
}

export interface CartItem extends Produto {
  quantidade: number;
}

export interface RankingItem {
  id: number;
  nome: string;
  email?: string;
  tipo_pessoa?: TipoPessoa;
  pontos_totais: number;
}

export interface InsightMarcaVenda {
  nome: string;
  quantidade: number;
  pontos_tratamento: number;
  pontos_coloracao: number;
}

export interface UsuarioInsights {
  id: number;
  nome: string;
  email: string;
  tipo_pessoa?: TipoPessoa;
  pontos_totais: number;
  pontos_totais_tratamento: number;
  pontos_totais_coloracao: number;
  marcas: InsightMarcaVenda[];
  lojas: { id: number; nome: string; quantidade: number; pontos_tratamento: number; pontos_coloracao: number }[];
}
