interface RouteConfig {
  [path: string]: string;
}

export const routeTitles: RouteConfig = {
  "/perfil": "Perfil",
  "/vendas": "Vendas",
  "/catalog": "Catálogo",

  "/ajuda": "Ajuda",

  "/backoffice": "Backoffice",
  "/backoffice/store/:id": "Estatísticas da Loja",
  "/backoffice/employee/:id": "Estatísticas do Vendedor",


  "/marcas": "Marcas",
  "/funcionarios": "Funcionarios",
  "/produtos": "Produtos",
  "/metas": "Metas",
  "/lojas": "Lojas",
  "/linhas": "Linhas",

  "/": "Dashboard",
  "/configuracoes": "Configurações",

  // Ajuste na rota de erro 404 para garantir que tenha um título informativo
  "/error404": "Página não encontrada",
};
