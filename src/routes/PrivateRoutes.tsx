import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Loader } from "../components/Loader";
import { TipoPessoa } from "../types";

import { Home } from "../pages/Home";
import { Catalog } from "../pages/Catalog";
import { Vendas } from "../pages/Vendas";
import { Perfil } from "../pages/Perfil";
import { Configuracoes } from "../pages/Configuracoes";
import { Ajuda } from "../pages/Ajuda";
import { Logout } from "../pages/Logout";
import { NotFound } from "../pages/NotFound";

// Paginas de gestao (ADMIN/MANAGER) sao carregadas sob demanda: as
// vendedoras, que usam o app quase sempre pelo celular, nunca baixam
// esse bundle - ele so entra na rede quando alguem com permissao de
// gestao efetivamente navega ate uma dessas rotas.
const Backoffice = lazy(() => import("../pages/Backoffice").then((m) => ({ default: m.Backoffice })));
const StoreInsights = lazy(() => import("../pages/Backoffice/StoreInsights").then((m) => ({ default: m.StoreInsights })));
const EmployeeInsights = lazy(() => import("../pages/Backoffice/EmployeeInsights").then((m) => ({ default: m.EmployeeInsights })));
const BrandInsights = lazy(() => import("../pages/Backoffice/BrandInsights").then((m) => ({ default: m.BrandInsights })));
const GerenciarVendas = lazy(() => import("../pages/Backoffice/GerenciarVendas").then((m) => ({ default: m.GerenciarVendas })));

const Marcas = lazy(() => import("../pages/Marcas").then((m) => ({ default: m.Marcas })));
const Produtos = lazy(() => import("../pages/Produtos").then((m) => ({ default: m.Produtos })));
const Linhas = lazy(() => import("../pages/Linhas").then((m) => ({ default: m.Linhas })));
const Lojas = lazy(() => import("../pages/Lojas").then((m) => ({ default: m.Lojas })));
const Metas = lazy(() => import("../pages/Metas").then((m) => ({ default: m.Metas })));
const Funcionarios = lazy(() => import("../pages/Funcionarios").then((m) => ({ default: m.Funcionarios })));

const GESTAO: TipoPessoa[] = [TipoPessoa.ADMIN, TipoPessoa.MANAGER];

function Gestao({ children }: { children: JSX.Element }) {
  return (
    <ProtectedRoute allowedRoles={GESTAO}>
      <Suspense fallback={<Loader label="Carregando módulo..." />}>{children}</Suspense>
    </ProtectedRoute>
  );
}

export function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />} path="/">
        <Route index element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/ajuda" element={<Ajuda />} />

        <Route path="/backoffice" element={<Gestao><Backoffice /></Gestao>} />
        <Route path="/backoffice/store/:id" element={<Gestao><StoreInsights /></Gestao>} />
        <Route path="/backoffice/employee/:id" element={<Gestao><EmployeeInsights /></Gestao>} />
        <Route path="/backoffice/brand/:id" element={<Gestao><BrandInsights /></Gestao>} />
        <Route path="/backoffice/vendas" element={<Gestao><GerenciarVendas /></Gestao>} />

        <Route path="/marcas" element={<Gestao><Marcas /></Gestao>} />
        <Route path="/produtos" element={<Gestao><Produtos /></Gestao>} />
        <Route path="/linhas" element={<Gestao><Linhas /></Gestao>} />
        <Route path="/lojas" element={<Gestao><Lojas /></Gestao>} />
        <Route path="/metas" element={<Gestao><Metas /></Gestao>} />
        <Route path="/funcionarios" element={<Gestao><Funcionarios /></Gestao>} />

        <Route path="/error404" element={<NotFound />} />
        <Route path="/sair" element={<Logout />} />
        <Route path="*" element={<Navigate to="/error404" replace />} />
      </Route>
    </Routes>
  );
}
