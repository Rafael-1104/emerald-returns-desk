import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Pencil } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/ui-kit/PageSection";
import { useUsuarios } from "@/lib/usuarios";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários | Sistema de Devoluções" },
      { name: "description", content: "Gestão de usuários e perfis do sistema de devoluções." },
      { property: "og:title", content: "Usuários | Sistema de Devoluções" },
      { property: "og:description", content: "Gestão de usuários e perfis do sistema de devoluções." },
    ],
  }),
  component: Usuarios,
});

function Usuarios() {
  const { usuarios } = useUsuarios();
  return (
    <AppLayout title="Usuários" subtitle="Cadastro de usuários e perfis de acesso">
      <div className="mx-auto max-w-[1200px]">
        <Panel
          title="Usuários cadastrados"
          description={`${usuarios.length} usuários`}
          bodyClassName="p-0"
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              <UserPlus className="h-4 w-4" /> Novo usuário
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Nome</th>
                  <th className="px-6 py-3 font-semibold">E-mail</th>
                  <th className="px-6 py-3 font-semibold">Perfil</th>
                  <th className="px-6 py-3 font-semibold">Situação</th>
                  <th className="px-6 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-border/70 last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-3.5 font-semibold text-foreground">{u.nome}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-3.5 text-foreground">{u.cargo}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={
                          u.ativo
                            ? "inline-flex rounded-full border border-primary/25 bg-primary/12 px-2.5 py-1 text-[11px] font-semibold text-primary-dark"
                            : "inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                        }
                      >
                        {u.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          title="Editar usuário"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
