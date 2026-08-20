import { supabase } from "@/lib/supabase";
import { campo, texto, type Payload } from "@/lib/supabase-flex";

/** Consulta pontual ao catálogo real (public.materiais) — nunca carrega a tabela inteira. */

export interface Material {
  codigo: string;
  descricao: string;
}

function mapear(linha: Payload, fallback: string): Material {
  return {
    codigo: texto(campo(linha, ["codigo", "codigo_material", "cod"])) ?? fallback,
    descricao: texto(campo(linha, ["descricao", "descricao_material", "nome"])) ?? "",
  };
}

export async function buscarMaterialPorCodigo(codigo: string): Promise<Material | null> {
  const alvo = codigo.trim();
  if (!alvo) return null;

  const { data, error } = await supabase.from("materiais").select("*").eq("codigo", alvo).limit(1);
  if (error) throw error;
  const linha = (data as Payload[] | null)?.[0];
  return linha ? mapear(linha, alvo) : null;
}

/** Descrições de vários códigos de uma vez (usado ao carregar itens já salvos). */
export async function buscarDescricoes(codigos: string[]): Promise<Map<string, string>> {
  const unicos = [...new Set(codigos.filter(Boolean))];
  const mapa = new Map<string, string>();
  if (unicos.length === 0) return mapa;

  const { data, error } = await supabase.from("materiais").select("*").in("codigo", unicos);
  if (error) return mapa;
  for (const linha of (data ?? []) as Payload[]) {
    const m = mapear(linha, "");
    if (m.codigo) mapa.set(m.codigo, m.descricao);
  }
  return mapa;
}
