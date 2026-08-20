import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { campo, texto, type Payload } from "@/lib/supabase-flex";

export interface PerfilUsuario {
  nome: string | null;
  cargo: string | null;
  email: string | null;
}

interface AuthContexto {
  sessao: Session | null;
  usuario: User | null;
  perfil: PerfilUsuario | null;
  carregando: boolean;
  nomeExibicao: string;
  iniciais: string;
  entrar: (email: string, senha: string) => Promise<{ erro: string | null }>;
  sair: () => Promise<void>;
}

const Ctx = createContext<AuthContexto | null>(null);

function derivarIniciais(nome: string) {
  const partes = nome.trim().split(/[\s.@_-]+/).filter(Boolean);
  const letras = partes.slice(0, 2).map((p) => p[0] ?? "");
  return (letras.join("") || "US").toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSessao(data.session ?? null);
      setCarregando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
      setCarregando(false);
    });

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const usuario = sessao?.user ?? null;

  // Dados complementares vindos da tabela existente `usuarios` (opcionais).
  useEffect(() => {
    let ativo = true;
    if (!usuario) {
      setPerfil(null);
      return;
    }
    void supabase
      .from("usuarios")
      .select("*")
      .eq("id", usuario.id)
      .limit(1)
      .then(({ data }) => {
        if (!ativo) return;
        const linha = (data as Payload[] | null)?.[0];
        setPerfil(
          linha
            ? {
                nome: texto(campo(linha, ["nome", "nome_completo", "name"])),
                cargo: texto(campo(linha, ["cargo", "funcao", "perfil"])),
                email: texto(campo(linha, ["email"])),
              }
            : null,
        );
      });
    return () => {
      ativo = false;
    };
  }, [usuario]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    return { erro: error ? error.message : null };
  }, []);

  const sair = useCallback(async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  }, []);

  const valor = useMemo<AuthContexto>(() => {
    const nomeExibicao = perfil?.nome ?? usuario?.email ?? "Usuário";
    return {
      sessao,
      usuario,
      perfil,
      carregando,
      nomeExibicao,
      iniciais: derivarIniciais(nomeExibicao),
      entrar,
      sair,
    };
  }, [sessao, usuario, perfil, carregando, entrar, sair]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return ctx;
}
