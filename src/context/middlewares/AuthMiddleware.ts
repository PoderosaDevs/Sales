import { ApolloLink } from '@apollo/client';

const authMiddleware = new ApolloLink((operation, forward) => {
  // Recupera o token do localStorage
  const token = localStorage.getItem('token');
  
  // Adiciona o token no header de autorização, se existir
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }

  // Continua com a execução da operação
  return forward(operation);
});

export { authMiddleware };
