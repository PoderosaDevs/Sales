import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { Home } from "../pages/Home";
import { Configuracoes } from "../pages/Configuracoes";
import { Perfil } from "../pages/Perfil";
import { Catalog } from "../pages/Catalog";
import { Logout } from "./pages/LogoutPage";
import Marcas from "../pages/Marcas";
import Funcionarios from "../pages/Funcionarios";
import Produtos from "../pages/Produtos";
import Metas from "../pages/Metas";
import Linhas from "../pages/Linhas";
import Lojas from "../pages/Lojas";
import { useAuth } from '../context/AuthContext';
import { CartProvider } from "../context/CartContext";
import ErrorsPage from "../pages/public/ErrorsPage";
import { ProtectedRoute } from "./partials/ProtectedRoute";
import { routeTitles } from "./routeConfig";
import { Ajuda } from "../pages/Ajuda";
import { Backoffice } from "../pages/Backoffice";
import { EmployeeInsights } from "../pages/Backoffice/EmployeeInsights";
import { StoreInsights } from "../pages/Backoffice/StoreInsights";


import { Vendas } from "../pages/Vendas";

export function PrivateRoutes() {
  const { usuarioData } = useAuth();
  const location = useLocation(); // Hook para obter a rota atual
  const currentPath = location.pathname; // Obtendo a rota atual

  // Verifique se a rota atual está nas rotas definidas no arquivo de configuração
  const isRouteValid = Object.keys(routeTitles).includes(currentPath);

  return (
    <Routes>
      <Route element={<AppLayout />} path="/">
        <Route index element={<Home />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route
          path="/catalog"
          element={
            <CartProvider>
              <Catalog />
            </CartProvider>
          }
        />
        <Route
          path="/vendas"
          element={
            <CartProvider>
              <Vendas />
            </CartProvider>
          }
        />
        <Route
          path="/ajuda"
          element={
            <CartProvider>
              <Ajuda />
            </CartProvider>
          }
        />


        {/* Backoffice Routes - Protegidas */}
        <Route
          path="/backoffice"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Backoffice />
            </ProtectedRoute>
          }
        />

        {/* Backoffice Routes - Protegidas */}
        <Route
          path="/backoffice/store/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <StoreInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/backoffice/employee/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <EmployeeInsights />
            </ProtectedRoute>
          }
        />

        {/* Backoffice Routes - Protegidas */}
        <Route
          path="/marcas"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Marcas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Funcionarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Produtos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lojas"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Lojas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/metas"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Metas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linhas"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Linhas />
            </ProtectedRoute>
          }
        />

        {/* Redireciona para a página de erro se a rota não for válida */}
        <Route path="*" element={isRouteValid ? null : <Navigate to="/error404" />} />

        {/* System Routes */}
        <Route path="/error404" element={<ErrorsPage />} />
        <Route path="/sair" element={<Logout />} />
      </Route>
    </Routes>
  );
}
