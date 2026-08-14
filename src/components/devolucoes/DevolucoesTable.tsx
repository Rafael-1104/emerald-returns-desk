import { Eye, FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { formatarData, totalItens, type Devolucao } from "@/lib/mock-data";

export function DevolucoesTable({
  data,
  onView,
}: {
  data: Devolucao[];
  onView?: (d: Devolucao) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-3 font-semibold">Requisição</th>
            <th className="px-6 py-3 font-semibold">Data</th>
            <th className="px-6 py-3 font-semibold">Usuário</th>
            <th className="px-6 py-3 font-semibold">Itens</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 text-right font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/50">
              <td className="px-6 py-3.5 font-semibold text-foreground">{d.requisicao}</td>
              <td className="px-6 py-3.5 text-muted-foreground">{formatarData(d.data)}</td>
              <td className="px-6 py-3.5 text-foreground">{d.usuario}</td>
              <td className="px-6 py-3.5 tabular-nums text-foreground">{totalItens(d)}</td>
              <td className="px-6 py-3.5">
                <StatusBadge status={d.status} />
              </td>
              <td className="px-6 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView?.(d)}
                    title="Visualizar devolução"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Gerar relatório"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                Nenhuma devolução encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
