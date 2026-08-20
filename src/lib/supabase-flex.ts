import { supabase } from "@/lib/supabase";

/**
 * Helpers tolerantes a diferenças de nomenclatura entre o frontend e a
 * estrutura EXISTENTE do banco. Nenhuma alteração de schema é feita:
 * quando o PostgREST informa que uma coluna não existe, tentamos um alias
 * conhecido e, se não houver, o campo é simplesmente descartado do payload.
 */

export type Payload = Record<string, unknown>;
export type Aliases = Record<string, string[]>;

const COLUNA_AUSENTE = /Could not find the '(.+?)' column/i;

function ajustar(linhas: Payload[], coluna: string, aliases: Aliases, usados: Set<string>) {
  const alternativa = (aliases[coluna] ?? []).find((a) => !usados.has(a));
  for (const linha of linhas) {
    const valor = linha[coluna];
    delete linha[coluna];
    if (alternativa) linha[alternativa] = valor;
  }
  if (alternativa) usados.add(alternativa);
}

export async function inserirFlex(
  tabela: string,
  linhas: Payload[],
  aliases: Aliases = {},
): Promise<Payload[]> {
  if (linhas.length === 0) return [];
  const rows = linhas.map((l) => ({ ...l }));
  const usados = new Set<string>(Object.keys(rows[0] ?? {}));

  for (let tentativa = 0; tentativa < 10; tentativa += 1) {
    const { data, error } = await supabase.from(tabela).insert(rows).select();
    if (!error) return (data ?? []) as Payload[];
    const faltante = error.message?.match(COLUNA_AUSENTE)?.[1];
    if (!faltante) throw error;
    ajustar(rows, faltante, aliases, usados);
  }
  throw new Error(`Não foi possível inserir em ${tabela}.`);
}

export async function atualizarFlex(
  tabela: string,
  id: string,
  patch: Payload,
  aliases: Aliases = {},
): Promise<void> {
  const row: Payload = { ...patch };
  const usados = new Set<string>(Object.keys(row));

  for (let tentativa = 0; tentativa < 10; tentativa += 1) {
    if (Object.keys(row).length === 0) return;
    const { error } = await supabase.from(tabela).update(row).eq("id", id);
    if (!error) return;
    const faltante = error.message?.match(COLUNA_AUSENTE)?.[1];
    if (!faltante) throw error;
    ajustar([row], faltante, aliases, usados);
  }
  throw new Error(`Não foi possível atualizar ${tabela}.`);
}

/** Primeiro valor definido entre várias possibilidades de nome de coluna. */
export function campo(linha: Payload, chaves: string[]): unknown {
  for (const chave of chaves) {
    const valor = linha[chave];
    if (valor !== undefined && valor !== null) return valor;
  }
  return null;
}

export const texto = (valor: unknown): string | null =>
  valor === null || valor === undefined ? null : String(valor);

export const numero = (valor: unknown): number => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};
