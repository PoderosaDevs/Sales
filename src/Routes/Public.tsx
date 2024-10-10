import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import Login from '../pages/public/Login'
import Register from "../pages/public/Register";
import ForgotPasswordComponent from "../pages/public/Forgot-Password";
export function PublicRoutes(){
  return(
    <Routes>
      <Route element={<AuthenticationLayout />} path="/">
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordComponent />} />

      </Route>
    </Routes>
  )
}