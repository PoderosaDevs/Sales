/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_PODEROSA_API_URL: string;
  VITE_APP_TITLE: string;
  // adicione outras variáveis de ambiente conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
