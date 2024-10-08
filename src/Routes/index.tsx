import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./Public";
import { PrivateRoutes } from "./Private";
import { useAuth } from "../context/AuthContext";


export function AppRoutes() {
  const { authenticated } = useAuth()

  return(
    <Routes>
      {authenticated ? (
        <Route path="/*" element={<PrivateRoutes />} />
      ) : (
        <Route path="/*" element={<PublicRoutes />} />
      )}
    </Routes>
  )
}