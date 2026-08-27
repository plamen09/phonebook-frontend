import { Navigate } from "react-router";
import { createElement, ReactNode } from "react";

import { useAuth } from "./auth/AuthContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return createElement("div", null, "loading...");
  }

  if (!isAuthenticated) {
    return createElement(Navigate, {
      to: "/login",
      replace: true,
    });
  }

  return children;
}

export default ProtectedRoute;