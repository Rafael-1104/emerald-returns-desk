import { statusLabels, type DevolucaoStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<DevolucaoStatus, string> = {
  finalizada: "bg-primary/12 text-primary-dark border-primary/25",
  em_andamento: "bg-info/10 text-info border-info/25",
  pendente: "bg-warning/15 text-warning-foreground border-warning/30",
  cancelada: "bg-destructive/10 text-destructive border-destructive/25",
};

export function StatusBadge({ status }: { status: DevolucaoStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
