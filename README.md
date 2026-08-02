# Front de Vendas (v2)

Reescrita do front antigo (React + Vite + TypeScript), consumindo a nova API
REST em `../api`. Mesmo visual "glass" escuro do app anterior, mas com
estrutura, tipagem e acessibilidade mobile refeitas do zero.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ja existe um .env com VITE_API_URL apontando pra API local
npm run dev             # http://localhost:5173
```

A API (`../api`) precisa estar rodando em paralelo (`npm run dev` lá, porta 8888).

Scripts: `npm run build` (typecheck + build de produção em `dist/`),
`npm run preview`, `npm run typecheck`.

## Estrutura

- `src/lib/api.ts` — cliente axios com interceptor de JWT e tratamento
  centralizado de erro/expiração de sessão.
- `src/context/AuthContext.tsx` — login, logout e verificação periódica de
  expiração do token (sem depender do usuário recarregar a página).
- `src/hooks/*` — um hook React Query por recurso da API (produtos, vendas,
  usuários, marcas, linhas, lojas, metas), cobrindo leitura e mutações.
- `src/components/ui/*` — primitivos reaproveitáveis (Button, Input, Select,
  Dialog, Card) usados em todas as telas para manter consistência visual.
- `src/pages/*` — uma pasta por tela. `Home`, `Catalog` e `Vendas` são a
  prioridade mobile (fluxo do dia a dia da vendedora); `Marcas`, `Produtos`,
  `Linhas`, `Lojas`, `Metas`, `Funcionarios` e `Backoffice` são a área de
  gestão (ADMIN/MANAGER), carregada sob demanda (ver abaixo).
- `src/routes/PrivateRoutes.tsx` — as rotas de gestão usam `React.lazy`, então
  esse código só é baixado pelo navegador quando alguém com permissão
  realmente abre uma dessas telas. Uma vendedora nunca baixa esse bundle.

## Diferenças/melhorias em relação ao front antigo

- Apollo/GraphQL → React Query + axios sobre a API REST nova.
- Sessão expira de forma ativa (checagem a cada 60s) em vez de só falhar na
  próxima chamada; ao expirar, mostra aviso e redireciona pro login.
- Tela de Perfil funcional: a vendedora edita foto, data de nascimento e
  senha de verdade (no front antigo o botão "Salvar" não fazia nada).
- Catálogo, carrinho e histórico de vendas redesenhados mobile-first
  (grid compacto, modais em tela cheia no celular, botões grandes o
  suficiente para toque).
- Telas de gestão (Produtos, Marcas, Linhas, Lojas, Metas, Funcionários,
  Backoffice com gráficos) reconstruídas com formulários validados
  (`react-hook-form` + `zod`) e mensagens de erro reais vindas da API.
- Code-splitting: a área de gestão fica em chunks separados, carregados só
  quando necessário — reduz o que uma vendedora baixa no celular.

## Papéis de acesso

- **Vendedora (EMPLOYEE)**: Home, Catálogo, Vendas, Perfil, Configurações,
  Ajuda.
- **Gerente/Administrador (MANAGER/ADMIN)**: tudo acima + Backoffice
  (rankings, gráficos por vendedora/marca/loja), Produtos, Categorias,
  Marcas, Linhas, Lojas, Metas e Funcionários.
