import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { recarregar } from "@/lib/devolucoes-store";

/** Bloqueia o conteúdo interno enquanto não houver sessão do Supabase. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { sessao, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && !sessao) void navigate({ to: "/login", replace: true });
  }, [carregando, sessao, navigate]);

  useEffect(() => {
    if (sessao) void recarregar();
  }, [sessao]);

  if (carregando || !sessao) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
