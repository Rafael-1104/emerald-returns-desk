import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui-kit/PageSection";
import { supabase, supabaseConfigurado, supabaseUrl } from "@/lib/supabase";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico da conexão | Sistema de Devoluções" },
      { name: "description", content: "Validação da conexão com o backend e das tabelas do sistema de devoluções." },
      { property: "og:title", content: "Diagnóstico da conexão | Sistema de Devoluções" },
      { property: "og:description", content: "Validação da conexão com o backend e das tabelas do sistema de devoluções." },
    ],
  }),
  ssr: false,
  component: Diagnostico,
});

const TABELAS = ["usuarios", "materiais", "devolucoes", "itens_devolucao", "volumes_item"] as const;

type Resultado = { nome: string; ok: boolean; detalhe: string };

function Diagnostico() {
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [auth, setAuth] = useState<Resultado | null>(null);
  const [vinculo, setVinculo] = useState<Resultado | null>(null);

  const executar = useCallback(async () => {
    setCarregando(true);
    const saida: Resultado[] = [];

    for (const tabela of TABELAS) {
      const { data, count, error } = await supabase.from(tabela).select("*", { count: "exact" }).limit(1);
      let detalhe = `acessível — ${count ?? data?.length ?? 0} registro(s) visível(is)`;
      if (error) {
        detalhe = [error.code, error.message, error.hint].filter(Boolean).join(" — ");
        if (!error.message) detalhe = await detalharErro(tabela);
      }
      saida.push({ nome: tabela, ok: !error, detalhe });
    }
    setResultados(saida);

    const { data: sessao, error: erroAuth } = await supabase.auth.getSession();
    const user = sessao?.session?.user ?? null;
    setAuth({
      nome: "auth.users (Supabase Auth)",
      ok: !erroAuth,
      detalhe: erroAuth
        ? erroAuth.message
        : user
          ? `sessão ativa — ${user.email ?? user.id}`
          : "serviço acessível — nenhum usuário autenticado no momento",
    });

    if (user) {
      const { data, error } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle();
      setVinculo({
        nome: "Vínculo auth.users → usuarios",
        ok: !error && Boolean(data),
        detalhe: error ? `${error.code ?? "erro"}: ${error.message}` : data ? "usuário localizado na tabela usuarios" : "nenhum registro correspondente em usuarios",
      });
    } else {
      setVinculo({
        nome: "Vínculo auth.users → usuarios",
        ok: false,
        detalhe: "não verificável sem usuário autenticado",
      });
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    void executar();
  }, [executar]);

  const linhas = [...(auth ? [auth] : []), ...resultados, ...(vinculo ? [vinculo] : [])];

  return (
    <AppLayout title="Diagnóstico da conexão" subtitle="Validação do backend e das estruturas existentes">
      <div className="mx-auto max-w-[1000px] space-y-6">
        <Panel title="Conexão" description="Configuração via variáveis de ambiente">
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Endpoint: <span className="font-medium text-foreground">{supabaseUrl || "não configurado"}</span>
            </p>
            <p className="text-muted-foreground">
              Chave publicável:{" "}
              <span className="font-medium text-foreground">{supabaseConfigurado ? "configurada" : "ausente"}</span>
            </p>
          </div>
        </Panel>

        <Panel
          title="Testes de acesso"
          description="Consultas somente leitura, sem alteração de dados"
          action={
            <button
              type="button"
              onClick={() => void executar()}
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark disabled:opacity-60"
            >
              {carregando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Reexecutar
            </button>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {linhas.map((r) => (
              <li key={r.nome} className="flex items-start gap-3 px-6 py-3.5">
                {r.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.nome}</p>
                  <p className="break-words text-xs text-muted-foreground">{r.detalhe}</p>
                </div>
              </li>
            ))}
            {!linhas.length && <li className="px-6 py-4 text-sm text-muted-foreground">Executando testes…</li>}
          </ul>
        </Panel>
      </div>
    </AppLayout>
  );
}
