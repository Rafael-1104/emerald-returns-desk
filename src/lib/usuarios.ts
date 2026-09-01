import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { campo, texto, type Payload } from "@/lib/supabase-flex";

/** Usuários reais da tabela public.usuarios (sem qualquer dado fictício). */
export interface UsuarioRegistro {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
}

export async function listarUsuarios(): Promise<UsuarioRegistro[]> {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) throw error;
  return ((data ?? []) as Payload[]).map((linha) => ({
    id: String(campo(linha, ["id"]) ?? ""),
    nome: texto(campo(linha, ["nome", "nome_completo", "username", "email"])) ?? "—",
    email: texto(campo(linha, ["email"])) ?? "—",
    cargo: texto(campo(linha, ["cargo", "perfil", "role"])) ?? "—",
    ativo: campo(linha, ["ativo"]) !== false,
  }));
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioRegistro[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    listarUsuarios()
      .then((lista) => {
        if (vivo) setUsuarios(lista);
      })
      .catch((e: unknown) => {
        if (vivo) setErro(e instanceof Error ? e.message : String(e));
      });
    return () => {
      vivo = false;
    };
  }, []);

  return { usuarios, erro };
}
