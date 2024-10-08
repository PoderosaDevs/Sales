import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./Routes"
import { AuthProvider } from "./context/AuthContext"
import { ApolloProvider } from "@apollo/client"
import { client } from "./services/conection"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ApolloProvider client={client}>
          <AppRoutes />
        </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App
