// types.ts

// Tipagem para um produto
export interface Produto {
  id: string;
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
}

// Tipagem para o item no carrinho, que inclui o produto e a quantidade
export interface CartItem extends Produto {
  quantidade: number;
}

// Tipagem para o contexto do carrinho
export interface ShoppingCartContextType {
  cartItems: CartItem[]; // Array de itens no carrinho
  addProduct: (produto: Produto) => void; // Função para adicionar um produto
  removeProduct: (produtoId: string) => void; // Função para remover um produto
  updateItemQuantity: (id: string, newQuantity: number) => void; // Função para atualizar a quantidade de um produto
  clearCart: () => void; // Função para limpar o carrinho
}
