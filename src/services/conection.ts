import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Certifique-se de que a variável de ambiente está definida
const API_URL = import.meta.env.VITE_PODEROSA_API_URL;

if (!API_URL) {
  console.log(API_URL)
  console.log(import.meta.env.VITE_PODEROSA_API_URL)
  throw new Error('VITE_PODEROSA_API_URL is not defined in environment variables');
}

let openModalCallback: (path: any) => void;

// Função para definir o callback para abrir o modal
export const setOpenModalCallback = (callback: (path: any) => void) => {
  openModalCallback = callback;
};

// Configuração do link de erro
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (message === "Error: Ip's are difrent") {
        window.location.href = '/logout';
      }

      if (message === "TokenExpiredError: jwt expired") {
        if (openModalCallback) {
          openModalCallback(path); // Chama a função para abrir o modal
        }
      }

      switch (extensions?.code) {
        case "UNAUTHENTICATED": {
          console.log('Unauthenticated');
          break;
        }
        default: {
          console.log('GraphQL Error:', extensions?.code);
        }
      }

      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Configuração do link HTTP
const httpLink = new HttpLink({
  uri: API_URL,
});

// Middleware para adicionar o token de autorização
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Adiciona o token ao cabeçalho
    },
  }));

  return forward(operation);
});

// Criação do cliente Apollo
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, httpLink]),
  defaultOptions: {
    mutate: { errorPolicy: 'all' },
  },
});
