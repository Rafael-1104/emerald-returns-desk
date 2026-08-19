import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do projeto existente do cliente.
 * Credenciais vêm exclusivamente de variáveis de ambiente (chave publicável — nunca service_role).
 */
const url = import.meta.env['VITE_APP_SUPABASE_URL'] as string | undefined;
const publishableKey = import.meta.env['VITE_APP_SUPABASE_PUBLISHABLE_KEY'] as string | undefined;

export const supabaseConfigurado = Boolean(url && publishableKey);

export const supabase = createClient(url ?? "http://localhost", publishableKey ?? "missing-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sistema-devolucoes-auth",
  },
});

export const supabaseUrl = url ?? "";
