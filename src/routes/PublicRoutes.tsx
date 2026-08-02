import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/auth/Login";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

// Não há tela pública de cadastro: contas são criadas por um ADMIN/MANAGER
// em Funcionários, de propósito — é a mesma regra de autorização aplicada
// na API (evita o auto-cadastro sem controle que a versão antiga permitia).
export function PublicRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />} path="/">
        <Route index element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Route>
    </Routes>
  );
}
