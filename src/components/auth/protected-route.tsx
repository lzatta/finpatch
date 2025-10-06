import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // spinner simples enquanto a sessão inicializa (com timeout no provider)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando…</div>
      </div>
    );
  }

  if (!user) {
    // sem usuário -> vai para login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
