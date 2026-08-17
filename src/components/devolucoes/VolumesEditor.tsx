import { Plus, Trash2 } from "lucide-react";

export interface VolumeRascunho {
  numero: number;
  quantidade: string;
}

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25";

export const somaVolumes = (volumes: VolumeRascunho[]) =>
  volumes.reduce((acc, v) => {
    const n = Number(v.quantidade);
    return acc + (Number.isFinite(n) && n > 0 ? n : 0);
  }, 0);

export function VolumesEditor({
  volumes,
  onChange,
  erro,
}: {
  volumes: VolumeRascunho[];
  onChange: (volumes: VolumeRascunho[]) => void;
  erro?: string | undefined;
}) {
  function alterar(index: number, quantidade: string) {
    onChange(volumes.map((v, i) => (i === index ? { ...v, quantidade } : v)));
  }

  function adicionar() {
    onChange([...volumes, { numero: volumes.length + 1, quantidade: "" }]);
  }

  function remover(index: number) {
    onChange(volumes.filter((_, i) => i !== index).map((v, i) => ({ ...v, numero: i + 1 })));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Volumes</p>
        <button
          type="button"
          onClick={adicionar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark"
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar volume
        </button>
      </div>

      <div className="space-y-2">
        {volumes.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs font-semibold text-muted-foreground">Volume {v.numero}</span>
            <input
              type="number"
              min={1}
              className={inputClass}
              placeholder="Quantidade"
              value={v.quantidade}
              onChange={(e) => alterar(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remover(i)}
              disabled={volumes.length === 1}
              title="Remover volume"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {erro && <p className="text-xs text-destructive">{erro}</p>}

      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quantidade total</span>
        <span className="text-base font-bold tabular-nums text-foreground">{somaVolumes(volumes)}</span>
      </div>
    </div>
  );
}
